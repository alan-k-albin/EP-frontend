import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowLeft, HiCamera } from 'react-icons/hi'
import { getMyProfile, updateProfile, addExperience, addEducation, addSkill } from '../../api/userAPI'

function EditProfile() {
  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    location: '',
    website: '',
  })
  const [experience, setExperience] = useState({ title: '', company: '', startDate: '', endDate: '', current: false })
  const [education, setEducation] = useState({ institution: '', degree: '', field: '', startYear: '', endYear: '' })
  const [skill, setSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getMyProfile().then((res) => {
      setForm({
        fullName: res.data.fullName || '',
        bio: res.data.bio || '',
        location: res.data.location || '',
        website: res.data.website || '',
      })
    })
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddExperience = async () => {
    try {
      await addExperience(experience)
      setExperience({ title: '', company: '', startDate: '', endDate: '', current: false })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddEducation = async () => {
    try {
      await addEducation(education)
      setEducation({ institution: '', degree: '', field: '', startYear: '', endYear: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddSkill = async () => {
    if (!skill.trim()) return
    try {
      await addSkill({ name: skill })
      setSkill('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 flex items-center justify-between">
        <Link to="/settings">
          <HiArrowLeft size={22} className="text-[#2B4593]" />
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Edit Profile</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-1.5 rounded-full disabled:opacity-50"
        >
          {saved ? 'Saved!' : loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="pt-16 px-4 pb-10">
        <div className="flex flex-col items-center py-6 border-b border-gray-100">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#2B4593] flex items-center justify-center text-white text-4xl font-bold">
              {form.fullName?.charAt(0)}
            </div>
            <div className="absolute bottom-0 right-0 bg-[#2B4593] rounded-full p-1.5">
              <HiCamera size={16} className="text-white" />
            </div>
          </div>
          <p className="text-sm text-[#2B4593] font-semibold mt-3">Change Photo</p>
        </div>

        <div className="py-4 space-y-4 border-b border-gray-100">
          <p className="font-bold text-gray-800">Basic Info</p>
          {[
            { label: 'Full Name', name: 'fullName', type: 'text' },
            { label: 'Bio', name: 'bio', type: 'text' },
            { label: 'Location', name: 'location', type: 'text' },
            { label: 'Website', name: 'website', type: 'text' },
          ].map((field) => (
            <div key={field.name}>
              <p className="text-xs text-gray-400 mb-1 font-semibold">{field.label}</p>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
              />
            </div>
          ))}
        </div>

        <div className="py-4 space-y-3 border-b border-gray-100">
          <p className="font-bold text-gray-800">Add Experience</p>
          {[
            { label: 'Title', key: 'title' },
            { label: 'Company', key: 'company' },
            { label: 'Start Date', key: 'startDate' },
            { label: 'End Date', key: 'endDate' },
          ].map((f) => (
            <input
              key={f.key}
              placeholder={f.label}
              value={experience[f.key]}
              onChange={(e) => setExperience({ ...experience, [f.key]: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
          ))}
          <button onClick={handleAddExperience} className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl">
            Add Experience
          </button>
        </div>

        <div className="py-4 space-y-3 border-b border-gray-100">
          <p className="font-bold text-gray-800">Add Education</p>
          {[
            { label: 'Institution', key: 'institution' },
            { label: 'Degree', key: 'degree' },
            { label: 'Field', key: 'field' },
            { label: 'Start Year', key: 'startYear' },
            { label: 'End Year', key: 'endYear' },
          ].map((f) => (
            <input
              key={f.key}
              placeholder={f.label}
              value={education[f.key]}
              onChange={(e) => setEducation({ ...education, [f.key]: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
          ))}
          <button onClick={handleAddEducation} className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl">
            Add Education
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="font-bold text-gray-800">Add Skill</p>
          <div className="flex gap-2">
            <input
              placeholder="e.g. React"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2B4593]"
            />
            <button onClick={handleAddSkill} className="bg-[#2B4593] text-white text-sm font-semibold px-4 py-2 rounded-xl">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile