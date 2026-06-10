import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiCamera, HiPencil, HiTrash, HiPlus } from 'react-icons/hi'
import {
  getMyProfile, updateProfile,
  addExperience, updateExperience, deleteExperience,
  addEducation, updateEducation, deleteEducation,
  addSkill, deleteSkill
} from '../../api/userAPI'
import { uploadProfilePhoto } from '../../api/mediaAPI'

function EditProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)

  // Basic form
  const [form, setForm] = useState({
    fullName: '', bio: '', location: '', website: '',
    occupation: '', industry: '', companySize: '',
    foundedYear: '', specialities: '', currentCompany: '',
  })

  // Experience form
  const [showExpForm, setShowExpForm] = useState(false)
  const [editingExp, setEditingExp] = useState(null)
  const [expForm, setExpForm] = useState({ title: '', company: '', startDate: '', endDate: '', current: false })

  // Education form
  const [showEduForm, setShowEduForm] = useState(false)
  const [editingEdu, setEditingEdu] = useState(null)
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', startYear: '', endYear: '' })

  // Skill form
  const [skillInput, setSkillInput] = useState('')

  useEffect(() => {
    getMyProfile().then((res) => {
      setProfile(res.data)
      setForm({
        fullName: res.data.fullName || '',
        bio: res.data.bio || '',
        location: res.data.location || '',
        website: res.data.website || '',
        occupation: res.data.occupation || '',
        industry: res.data.industry || '',
        companySize: res.data.companySize || '',
        foundedYear: res.data.foundedYear || '',
        specialities: res.data.specialities || '',
        currentCompany: res.data.currentCompany || '',
      })
    }).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const res = await uploadProfilePhoto(file)
      setProfile({ ...profile, profilePhoto: res.data.url })
    } catch (err) {
      console.error(err)
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleAddExperience = async () => {
    try {
      if (editingExp) {
        const res = await updateExperience(editingExp, expForm)
        setProfile({
          ...profile,
          experience: profile.experience.map((e) => e.id === editingExp ? res.data : e)
        })
      } else {
        const res = await addExperience(expForm)
        setProfile({ ...profile, experience: [res.data, ...profile.experience] })
      }
      setExpForm({ title: '', company: '', startDate: '', endDate: '', current: false })
      setShowExpForm(false)
      setEditingExp(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteExperience = async (expId) => {
    try {
      await deleteExperience(expId)
      setProfile({ ...profile, experience: profile.experience.filter((e) => e.id !== expId) })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddEducation = async () => {
    try {
      if (editingEdu) {
        const res = await updateEducation(editingEdu, eduForm)
        setProfile({
          ...profile,
          education: profile.education.map((e) => e.id === editingEdu ? res.data : e)
        })
      } else {
        const res = await addEducation(eduForm)
        setProfile({ ...profile, education: [res.data, ...profile.education] })
      }
      setEduForm({ institution: '', degree: '', field: '', startYear: '', endYear: '' })
      setShowEduForm(false)
      setEditingEdu(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteEducation = async (eduId) => {
    try {
      await deleteEducation(eduId)
      setProfile({ ...profile, education: profile.education.filter((e) => e.id !== eduId) })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddSkill = async () => {
    if (!skillInput.trim()) return
    try {
      const res = await addSkill({ name: skillInput })
      setProfile({ ...profile, skills: [...profile.skills, res.data] })
      setSkillInput('')
    } catch (err) {
      console.error(err)
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

  const isStudentOrProfessional = profile?.userType === 'student' || profile?.userType === 'professional'
  const isCompany = profile?.userType === 'company'
  const isPublic = profile?.userType === 'public'

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading...</p>

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Top Bar */}
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
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
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
                {form.fullName?.charAt(0)}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-[#2B4593] rounded-full p-1.5">
              <HiCamera size={16} className="text-white" />
            </div>
          </div>
          <input type="file" accept="image/*" className="hidden" id="photoUpload" onChange={handlePhotoUpload} />
          <label htmlFor="photoUpload" className="text-sm text-[#2B4593] font-semibold mt-3 cursor-pointer">
            {photoUploading ? 'Uploading...' : 'Change Photo'}
          </label>
        </div>

        {/* Basic Info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="font-bold text-gray-800 mb-4">Basic Info</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Full Name</p>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Bio</p>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Tell us about yourself"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593] resize-none"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Location</p>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, Country"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Website</p>
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

        {/* Public specific */}
        {isPublic && (
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 mb-4">Occupation</p>
            <input
              type="text"
              value={form.occupation}
              onChange={(e) => setForm({ ...form, occupation: e.target.value })}
              placeholder="e.g. Farmer, Driver, Tailor"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
          </div>
        )}

        {/* Company specific */}
        {isCompany && (
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 mb-4">Company Details</p>
            <div className="space-y-3">
              {[
                { label: 'Industry', key: 'industry', placeholder: 'e.g. Technology, Healthcare' },
                { label: 'Company Size', key: 'companySize', placeholder: 'e.g. 1-10, 11-50, 51-200' },
                { label: 'Founded Year', key: 'foundedYear', placeholder: 'e.g. 2010' },
                { label: 'Specialities', key: 'specialities', placeholder: 'e.g. Software, AI, Design' },
              ].map((f) => (
                <div key={f.key}>
                  <p className="text-xs text-gray-400 mb-1">{f.label}</p>
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

        {/* Professional current company */}
        {profile?.userType === 'professional' && (
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 mb-4">Current Company</p>
            <input
              type="text"
              value={form.currentCompany}
              onChange={(e) => setForm({ ...form, currentCompany: e.target.value })}
              placeholder="e.g. Google, Microsoft"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
          </div>
        )}

        {/* Experience — Students & Professionals */}
        {isStudentOrProfessional && (
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-800">Experience</p>
              <button
                onClick={() => { setShowExpForm(true); setEditingExp(null); setExpForm({ title: '', company: '', startDate: '', endDate: '', current: false }) }}
                className="flex items-center gap-1 text-[#2B4593] text-sm font-semibold"
              >
                <HiPlus size={16} /> Add
              </button>
            </div>

            {showExpForm && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
                {[
                  { label: 'Title', key: 'title', placeholder: 'e.g. Software Engineer' },
                  { label: 'Company', key: 'company', placeholder: 'e.g. Google' },
                  { label: 'Start Date', key: 'startDate', placeholder: 'e.g. Jan 2024' },
                  { label: 'End Date', key: 'endDate', placeholder: 'e.g. Dec 2024' },
                ].map((f) => (
                  <input
                    key={f.key}
                    placeholder={f.placeholder}
                    value={expForm[f.key]}
                    onChange={(e) => setExpForm({ ...expForm, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593] bg-white"
                  />
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={expForm.current}
                    onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })}
                    className="accent-[#2B4593]"
                  />
                  <p className="text-sm text-gray-600">Currently working here</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddExperience} className="flex-1 bg-[#2B4593] text-white py-2 rounded-xl text-sm font-semibold">
                    {editingExp ? 'Update' : 'Add'}
                  </button>
                  <button onClick={() => { setShowExpForm(false); setEditingExp(null) }} className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-xl text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {profile?.experience?.map((exp) => (
              <div key={exp.id} className="flex items-start gap-3 py-3 border-b border-gray-50">
                <div className="w-10 h-10 rounded-lg bg-[#8EB3E7] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {exp.company?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{exp.title}</p>
                  <p className="text-xs text-gray-500">{exp.company}</p>
                  <p className="text-xs text-gray-400">{exp.start_date} - {exp.current ? 'Present' : exp.end_date}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setEditingExp(exp.id)
                    setExpForm({ title: exp.title, company: exp.company, startDate: exp.start_date, endDate: exp.end_date, current: exp.current })
                    setShowExpForm(true)
                  }}>
                    <HiPencil size={16} className="text-[#2B4593]" />
                  </button>
                  <button onClick={() => handleDeleteExperience(exp.id)}>
                    <HiTrash size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education — Students & Professionals */}
        {isStudentOrProfessional && (
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-800">Education</p>
              <button
                onClick={() => { setShowEduForm(true); setEditingEdu(null); setEduForm({ institution: '', degree: '', field: '', startYear: '', endYear: '' }) }}
                className="flex items-center gap-1 text-[#2B4593] text-sm font-semibold"
              >
                <HiPlus size={16} /> Add
              </button>
            </div>

            {showEduForm && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
                {[
                  { label: 'Institution', key: 'institution', placeholder: 'e.g. MIT' },
                  { label: 'Degree', key: 'degree', placeholder: 'e.g. B.Tech' },
                  { label: 'Field', key: 'field', placeholder: 'e.g. Computer Science' },
                  { label: 'Start Year', key: 'startYear', placeholder: 'e.g. 2020' },
                  { label: 'End Year', key: 'endYear', placeholder: 'e.g. 2024' },
                ].map((f) => (
                  <input
                    key={f.key}
                    placeholder={f.placeholder}
                    value={eduForm[f.key]}
                    onChange={(e) => setEduForm({ ...eduForm, [f.key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593] bg-white"
                  />
                ))}
                <div className="flex gap-2">
                  <button onClick={handleAddEducation} className="flex-1 bg-[#2B4593] text-white py-2 rounded-xl text-sm font-semibold">
                    {editingEdu ? 'Update' : 'Add'}
                  </button>
                  <button onClick={() => { setShowEduForm(false); setEditingEdu(null) }} className="flex-1 border border-gray-200 text-gray-500 py-2 rounded-xl text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {profile?.education?.map((edu) => (
              <div key={edu.id} className="flex items-start gap-3 py-3 border-b border-gray-50">
                <div className="w-10 h-10 rounded-lg bg-[#2B4593] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {edu.institution?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{edu.institution}</p>
                  <p className="text-xs text-gray-500">{edu.degree} · {edu.field}</p>
                  <p className="text-xs text-gray-400">{edu.start_year} - {edu.end_year}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setEditingEdu(edu.id)
                    setEduForm({ institution: edu.institution, degree: edu.degree, field: edu.field, startYear: edu.start_year, endYear: edu.end_year })
                    setShowEduForm(true)
                  }}>
                    <HiPencil size={16} className="text-[#2B4593]" />
                  </button>
                  <button onClick={() => handleDeleteEducation(edu.id)}>
                    <HiTrash size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills — Students & Professionals */}
        {isStudentOrProfessional && (
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="font-bold text-gray-800 mb-4">Skills</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. React, Leadership"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#2B4593]"
              />
              <button onClick={handleAddSkill} className="bg-[#2B4593] text-white px-4 py-2 rounded-xl text-sm font-semibold">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((skill) => (
                <div key={skill.id} className="flex items-center gap-1 bg-[#8EB3E7]/20 text-[#2B4593] text-xs px-3 py-1.5 rounded-full">
                  <span>{skill.name}</span>
                  <button onClick={() => handleDeleteSkill(skill.id)}>
                    <HiTrash size={12} className="text-red-400 ml-1" />
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