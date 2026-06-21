import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiCamera, HiPencil, HiTrash, HiPlus, HiX } from 'react-icons/hi'
import {
  getMyProfile, updateProfile,
  addExperience, updateExperience, deleteExperience,
  addEducation, updateEducation, deleteEducation,
  addSkill, deleteSkill
} from '../../api/userAPI'
import { uploadProfilePhoto } from '../../api/mediaAPI'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

function normalizeProfile(p) {
  if (!p) return p
  return {
    ...p,
    fullName: p.fullName || p.full_name || '',
    profilePhoto: p.profilePhoto || p.profile_photo || '',
    userType: p.userType || p.user_type || '',
    isVerified: p.isVerified ?? p.is_verified ?? false,
    currentCompany: p.currentCompany || p.current_company || '',
    companySize: p.companySize || p.company_size || '',
    foundedYear: p.foundedYear || p.founded_year || '',
    bio: p.bio || '',
    location: p.location || '',
    website: p.website || '',
    occupation: p.occupation || '',
    industry: p.industry || '',
    specialities: p.specialities || '',
    experience: p.experience || [],
    education: p.education || [],
    skills: p.skills || [],
  }
}

function EditProfile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [showPhotoMenu, setShowPhotoMenu] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    location: '',
    website: '',
    occupation: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    specialities: '',
    currentCompany: '',
  })

  const [showExpForm, setShowExpForm] = useState(false)
  const [editingExpId, setEditingExpId] = useState(null)
  const [expForm, setExpForm] = useState({
    title: '', company: '', startDate: '', endDate: '', current: false
  })

  const [showEduForm, setShowEduForm] = useState(false)
  const [editingEduId, setEditingEduId] = useState(null)
  const [eduForm, setEduForm] = useState({
    institution: '', degree: '', field: '', startYear: '', endYear: ''
  })

  const [skillInput, setSkillInput] = useState('')
  const [skillError, setSkillError] = useState('')

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        const p = normalizeProfile(res.data)
        setProfile(p)
        setForm({
          fullName: p.fullName || '',
          bio: p.bio || '',
          location: p.location || '',
          website: p.website || '',
          occupation: p.occupation || '',
          industry: p.industry || '',
          companySize: p.companySize || '',
          foundedYear: p.foundedYear || '',
          specialities: p.specialities || '',
          currentCompany: p.currentCompany || '',
        })
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      setError('Full name is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      await updateProfile(form)
      updateUser({ fullName: form.fullName })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoUploading(true)
    setShowPhotoMenu(false)
    try {
      const res = await uploadProfilePhoto(file)
      const photoUrl = res.data.url || res.data.profilePhoto || res.data.profile_photo
      setProfile({ ...profile, profilePhoto: photoUrl })
      updateUser({ profilePhoto: photoUrl })
    } catch (err) {
      console.error(err)
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleRemovePhoto = async () => {
    setShowPhotoMenu(false)
    try {
      await API.delete('/users/me/profile-photo')
      setProfile({ ...profile, profilePhoto: '' })
      updateUser({ profilePhoto: null })
    } catch (err) {
      console.error(err)
    }
  }

  const openEditExp = (exp) => {
    setEditingExpId(exp.id)
    setExpForm({
      title: exp.title || '',
      company: exp.company || '',
      startDate: exp.start_date || exp.startDate || '',
      endDate: exp.end_date || exp.endDate || '',
      current: exp.current || false,
    })
    setShowExpForm(true)
  }

  const handleSaveExp = async () => {
    if (!expForm.title || !expForm.company) return
    try {
      if (editingExpId) {
        const res = await updateExperience(editingExpId, expForm)
        const updated = normalizeProfile({ ...profile, experience: profile.experience.map((e) => e.id === editingExpId ? res.data : e) })
        setProfile(updated)
      } else {
        const res = await addExperience(expForm)
        setProfile({ ...profile, experience: [res.data, ...profile.experience] })
      }
      setShowExpForm(false)
      setEditingExpId(null)
      setExpForm({ title: '', company: '', startDate: '', endDate: '', current: false })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteExp = async (expId) => {
    try {
      await deleteExperience(expId)
      setProfile({ ...profile, experience: profile.experience.filter((e) => e.id !== expId) })
    } catch (err) {
      console.error(err)
    }
  }

  const openEditEdu = (edu) => {
    setEditingEduId(edu.id)
    setEduForm({
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startYear: edu.start_year || edu.startYear || '',
      endYear: edu.end_year || edu.endYear || '',
    })
    setShowEduForm(true)
  }

  const handleSaveEdu = async () => {
    if (!eduForm.institution) return
    try {
      if (editingEduId) {
        const res = await updateEducation(editingEduId, eduForm)
        setProfile({
          ...profile,
          education: profile.education.map((e) => e.id === editingEduId ? res.data : e)
        })
      } else {
        const res = await addEducation(eduForm)
        setProfile({ ...profile, education: [res.data, ...profile.education] })
      }
      setShowEduForm(false)
      setEditingEduId(null)
      setEduForm({ institution: '', degree: '', field: '', startYear: '', endYear: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteEdu = async (eduId) => {
    try {
      await deleteEducation(eduId)
      setProfile({ ...profile, education: profile.education.filter((e) => e.id !== eduId) })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddSkill = async () => {
    if (!skillInput.trim()) return
    setSkillError('')
    try {
      const res = await addSkill({ name: skillInput.trim() })
      setProfile({ ...profile, skills: [...profile.skills, res.data] })
      setSkillInput('')
    } catch (err) {
      setSkillError(err.response?.data?.message || 'Failed to add skill')
    }
  }

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteSkill(skillId)
      setProfile({ ...profile, skills: profile.skills.filter((s) => s.id !== skillId) })
    } catch (err) {
      console.error(err)
    }
  }

  const userType = profile?.userType || user?.userType || user?.user_type
  const isStudentOrProfessional = userType === 'student' || userType === 'professional'
  const isCompany = userType === 'company'
  const isPublic = userType === 'public'

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 z-50 flex items-center justify-between">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-gray-500" />
        </Link>
        <h1 className="text-base font-semibold text-gray-800">Edit Profile</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2B4593] text-white text-sm font-semibold px-5 py-1.5 rounded-full disabled:opacity-50"
        >
          {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="pt-16">

        {/* Profile Photo */}
        <div className="flex flex-col items-center py-6 border-b border-gray-100 px-4">
          <div className="relative">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt="profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#2B4593] flex items-center justify-center text-white text-4xl font-bold">
                {form.fullName?.charAt(0) || '?'}
              </div>
            )}
            <button
              onClick={() => setShowPhotoMenu(!showPhotoMenu)}
              className="absolute bottom-0 right-0 bg-[#2B4593] rounded-full p-1.5"
            >
              <HiCamera size={16} className="text-white" />
            </button>
          </div>

          <p
            className="text-sm text-[#2B4593] font-semibold mt-2 cursor-pointer"
            onClick={() => setShowPhotoMenu(!showPhotoMenu)}
          >
            {photoUploading ? 'Uploading...' : 'Edit Photo'}
          </p>

          {/* Inline dropdown menu */}
          {showPhotoMenu && (
            <div className="mt-3 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden w-56">
              <label
                htmlFor="photoUpload"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                <HiCamera size={16} className="text-[#2B4593]" />
                Upload New Photo
              </label>
              {profile?.profilePhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                >
                  <HiTrash size={16} className="text-red-400" />
                  Remove Photo
                </button>
              )}
            </div>
          )}
        </div>

        <input type="file" accept="image/*" className="hidden" id="photoUpload" onChange={handlePhotoUpload} />

        {/* Error */}
        {error && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="px-4 py-5 border-b border-gray-100">
          <p className="font-bold text-gray-800 mb-4">Basic Info</p>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Full Name *</p>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Bio</p>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] resize-none"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Location</p>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, Country"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1.5 font-medium">Website</p>
              <input
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
              />
            </div>
          </div>
        </div>

        {/* Public — Occupation */}
        {isPublic && (
          <div className="px-4 py-5 border-b border-gray-100">
            <p className="font-bold text-gray-800 mb-4">What do you do?</p>
            <input
              type="text"
              value={form.occupation}
              onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              placeholder="e.g. Chef, Artist, Entrepreneur..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
          </div>
        )}

        {/* Company Details */}
        {isCompany && (
          <div className="px-4 py-5 border-b border-gray-100">
            <p className="font-bold text-gray-800 mb-4">Company Details</p>
            <div className="space-y-4">
              {[
                { label: 'Industry', key: 'industry', placeholder: 'e.g. Technology, Healthcare, Education' },
                { label: 'Company Size', key: 'companySize', placeholder: 'e.g. 1-10, 11-50, 51-200, 200+' },
                { label: 'Founded Year', key: 'foundedYear', placeholder: 'e.g. 2015' },
                { label: 'Specialities', key: 'specialities', placeholder: 'e.g. AI, Cloud Computing, Mobile Apps' },
              ].map((f) => (
                <div key={f.key}>
                  <p className="text-xs text-gray-400 mb-1.5 font-medium">{f.label}</p>
                  <input
                    type="text"
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Current Company */}
        {userType === 'professional' && (
          <div className="px-4 py-5 border-b border-gray-100">
            <p className="font-bold text-gray-800 mb-4">Current Company</p>
            <input
              type="text"
              value={form.currentCompany}
              onChange={(e) => setForm({ ...form, currentCompany: e.target.value })}
              placeholder="e.g. Google, Microsoft, Startup"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
          </div>
        )}

        {/* Experience */}
        {isStudentOrProfessional && (
          <div className="px-4 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-800">Experience</p>
              <button
                onClick={() => {
                  setEditingExpId(null)
                  setExpForm({ title: '', company: '', startDate: '', endDate: '', current: false })
                  setShowExpForm(true)
                }}
                className="flex items-center gap-1 text-[#2B4593] text-sm font-semibold"
              >
                <HiPlus size={16} /> Add
              </button>
            </div>

            {showExpForm && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">
                    {editingExpId ? 'Edit Experience' : 'Add Experience'}
                  </p>
                  <button onClick={() => { setShowExpForm(false); setEditingExpId(null) }}>
                    <HiX size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Job Title *', key: 'title', placeholder: 'e.g. Software Engineer' },
                    { label: 'Company *', key: 'company', placeholder: 'e.g. Google' },
                    { label: 'Start Date', key: 'startDate', placeholder: 'e.g. Jan 2024' },
                    { label: 'End Date', key: 'endDate', placeholder: 'e.g. Dec 2024' },
                  ].map((f) => (
                    <div key={f.key}>
                      <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                      <input
                        placeholder={f.placeholder}
                        value={expForm[f.key]}
                        onChange={(e) => setExpForm({ ...expForm, [f.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593] bg-white"
                      />
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="currentJob"
                      checked={expForm.current}
                      onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })}
                      className="accent-[#2B4593]"
                    />
                    <label htmlFor="currentJob" className="text-sm text-gray-600">Currently working here</label>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleSaveExp} className="flex-1 bg-[#2B4593] text-white py-2.5 rounded-xl text-sm font-semibold">
                    {editingExpId ? 'Update' : 'Add Experience'}
                  </button>
                  <button onClick={() => { setShowExpForm(false); setEditingExpId(null) }} className="flex-1 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {profile?.experience?.length === 0 && !showExpForm && (
              <p className="text-sm text-gray-400 text-center py-4">No experience added yet</p>
            )}

            {profile?.experience?.map((exp) => (
              <div key={exp.id} className="flex items-start gap-3 py-4 border-b border-gray-50 last:border-0">
                <div className="w-11 h-11 rounded-xl bg-[#8EB3E7]/20 flex items-center justify-center text-[#2B4593] font-bold text-sm flex-shrink-0">
                  {exp.company?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{exp.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{exp.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {exp.start_date || exp.startDate} — {exp.current ? 'Present' : (exp.end_date || exp.endDate)}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEditExp(exp)} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <HiPencil size={15} className="text-[#2B4593]" />
                  </button>
                  <button onClick={() => handleDeleteExp(exp.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                    <HiTrash size={15} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {isStudentOrProfessional && (
          <div className="px-4 py-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-800">Education</p>
              <button
                onClick={() => {
                  setEditingEduId(null)
                  setEduForm({ institution: '', degree: '', field: '', startYear: '', endYear: '' })
                  setShowEduForm(true)
                }}
                className="flex items-center gap-1 text-[#2B4593] text-sm font-semibold"
              >
                <HiPlus size={16} /> Add
              </button>
            </div>

            {showEduForm && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">
                    {editingEduId ? 'Edit Education' : 'Add Education'}
                  </p>
                  <button onClick={() => { setShowEduForm(false); setEditingEduId(null) }}>
                    <HiX size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Institution *', key: 'institution', placeholder: 'e.g. MIT, IIT Bombay' },
                    { label: 'Degree', key: 'degree', placeholder: 'e.g. B.Tech, M.Sc' },
                    { label: 'Field of Study', key: 'field', placeholder: 'e.g. Computer Science' },
                    { label: 'Start Year', key: 'startYear', placeholder: 'e.g. 2020' },
                    { label: 'End Year', key: 'endYear', placeholder: 'e.g. 2024 (or leave blank)' },
                  ].map((f) => (
                    <div key={f.key}>
                      <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                      <input
                        placeholder={f.placeholder}
                        value={eduForm[f.key]}
                        onChange={(e) => setEduForm({ ...eduForm, [f.key]: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593] bg-white"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleSaveEdu} className="flex-1 bg-[#2B4593] text-white py-2.5 rounded-xl text-sm font-semibold">
                    {editingEduId ? 'Update' : 'Add Education'}
                  </button>
                  <button onClick={() => { setShowEduForm(false); setEditingEduId(null) }} className="flex-1 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {profile?.education?.length === 0 && !showEduForm && (
              <p className="text-sm text-gray-400 text-center py-4">No education added yet</p>
            )}

            {profile?.education?.map((edu) => (
              <div key={edu.id} className="flex items-start gap-3 py-4 border-b border-gray-50 last:border-0">
                <div className="w-11 h-11 rounded-xl bg-[#2B4593]/10 flex items-center justify-center text-[#2B4593] font-bold text-sm flex-shrink-0">
                  {edu.institution?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{edu.institution}</p>
                  {edu.degree && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      {edu.degree} {edu.field ? `· ${edu.field}` : ''}
                    </p>
                  )}
                  {(edu.start_year || edu.startYear) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {edu.start_year || edu.startYear} — {edu.end_year || edu.endYear || 'Present'}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEditEdu(edu)} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <HiPencil size={15} className="text-[#2B4593]" />
                  </button>
                  <button onClick={() => handleDeleteEdu(edu.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                    <HiTrash size={15} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {isStudentOrProfessional && (
          <div className="px-4 py-5">
            <p className="font-bold text-gray-800 mb-4">Skills</p>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. React, Python, Leadership"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593]"
              />
              <button onClick={handleAddSkill} className="bg-[#2B4593] text-white px-4 py-2 rounded-xl text-sm font-semibold">
                Add
              </button>
            </div>
            {skillError && <p className="text-xs text-red-400 mb-2">{skillError}</p>}
            <p className="text-xs text-gray-400 mb-3">Press Enter or tap Add</p>
            {profile?.skills?.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">No skills added yet</p>
            )}
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((skill) => (
                <div key={skill.id} className="flex items-center gap-1.5 bg-[#2B4593]/5 border border-[#2B4593]/20 text-[#2B4593] text-xs px-3 py-1.5 rounded-full">
                  <span className="font-medium">{skill.name}</span>
                  <button onClick={() => handleDeleteSkill(skill.id)} className="ml-0.5">
                    <HiX size={12} className="text-red-400 hover:text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default EditProfile