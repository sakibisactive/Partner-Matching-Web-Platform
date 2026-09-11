import React, { useState, useEffect } from 'react';
import { useGetMeQuery } from '../../redux/services/authApi';
import {
  useUpdateProfileMutation,
  useGetQuestionsQuery,
  useSubmitPersonalityMutation,
  useGetInterestsQuery,
  useUpdateInterestsMutation,
  useAddPhotoMutation,
} from '../../redux/services/profileApi';
import { Save, Sparkles, CheckCircle2, Sliders, Image, ListChecks, Share2, Search, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';

const POPULAR_COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Bangladesh',
  'Germany', 'France', 'Japan', 'India', 'United Arab Emirates',
  'Singapore', 'Brazil', 'Italy', 'Spain', 'Netherlands',
  'Sweden', 'Switzerland', 'South Korea', 'Turkey', 'Saudi Arabia',
  'Egypt', 'South Africa', 'Nigeria', 'Mexico', 'Indonesia'
];

const POPULAR_CITIES = [
  'New York', 'London', 'Paris', 'Tokyo', 'Sydney',
  'Toronto', 'Berlin', 'Dubai', 'Singapore', 'Dhaka',
  'Los Angeles', 'Chicago', 'San Francisco', 'Miami', 'Vancouver',
  'Melbourne', 'Amsterdam', 'Madrid', 'Rome', 'Mumbai',
  'Delhi', 'Seoul', 'Istanbul', 'Riyadh', 'Barcelona'
];

const POPULAR_OCCUPATIONS = [
  'Software Engineer', 'Data Scientist', 'Product Designer', 'Architect',
  'Doctor / Physician', 'Financial Analyst', 'Marketing Specialist',
  'Entrepreneur / Founder', 'Lawyer / Attorney', 'Accountant', 'Civil Engineer',
  'Mechanical Engineer', 'Photographer', 'Journalist', 'Chef / Culinary Artist',
  'University Professor', 'School Teacher', 'Pilot', 'Registered Nurse',
  'Graphic Designer', 'Fitness Trainer / Coach', 'Content Creator', 'Student', 'Other'
];

const POPULAR_EDUCATION = [
  'High School Diploma', 'Associate Degree', 'Bachelor of Science (B.Sc)',
  'Bachelor of Arts (B.A)', 'Bachelor of Business (BBA)', 'Bachelor of Engineering (B.Eng)',
  'Master of Science (M.Sc)', 'Master of Business Administration (MBA)',
  'Doctor of Medicine (MD)', 'Ph.D. / Doctorate', 'Juris Doctor (J.D)',
  'Diploma / Vocational Training', 'Self-Taught / Professional Experience', 'Other'
];

export const EditProfilePage: React.FC = () => {
  const { data: meData, refetch: refetchMe, isLoading: isMeLoading } = useGetMeQuery(undefined);
  const { data: questionsData } = useGetQuestionsQuery(undefined);
  const { data: interestsData } = useGetInterestsQuery(undefined);

  const [updateProfile] = useUpdateProfileMutation();
  const [submitPersonality] = useSubmitPersonalityMutation();
  const [updateInterests] = useUpdateInterestsMutation();
  const [addPhoto] = useAddPhotoMutation();

  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'personality' | 'interests' | 'photos'>('basic');
  const [savedSuccessMessage, setSavedSuccessMessage] = useState('');

  // Basic Info state
  const [bio, setBio] = useState('');
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState('Male');

  // Dropdown states
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');

  // Custom input fallbacks if "Other" is typed
  const [customCity, setCustomCity] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [customOccupation, setCustomOccupation] = useState('');
  const [customEducation, setCustomEducation] = useState('');

  // Lifestyle state
  const [smoking, setSmoking] = useState<string>('');
  const [drinking, setDrinking] = useState<string>('');
  const [exercise, setExercise] = useState<string>('');
  const [diet, setDiet] = useState<string>('');
  const [pets, setPets] = useState<string>('');

  // Optional Social Links state
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [snapchat, setSnapchat] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Personality 50 answers state
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Interests state & Search
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);
  const [hobbySearch, setHobbySearch] = useState('');
  const [congratsModal, setCongratsModal] = useState({ show: false, percentage: 0 });

  // Photo URL input state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    if (meData?.profile) {
      const p = meData.profile;
      setBio(p.bio || '');
      setAge(p.age || 24);
      setGender(p.gender || 'Male');

      if (p.city) {
        if (POPULAR_CITIES.includes(p.city)) setCity(p.city);
        else {
          setCity('Other');
          setCustomCity(p.city);
        }
      }
      if (p.country) {
        if (POPULAR_COUNTRIES.includes(p.country)) setCountry(p.country);
        else {
          setCountry('Other');
          setCustomCountry(p.country);
        }
      }

      if (p.occupation) {
        if (POPULAR_OCCUPATIONS.includes(p.occupation)) setOccupation(p.occupation);
        else {
          setOccupation('Other');
          setCustomOccupation(p.occupation);
        }
      }
      if (p.education) {
        if (POPULAR_EDUCATION.includes(p.education)) setEducation(p.education);
        else {
          setEducation('Other');
          setCustomEducation(p.education);
        }
      }

      if (p.lifestyle) {
        setSmoking(p.lifestyle.smoking || '');
        setDrinking(p.lifestyle.drinking || '');
        setExercise(p.lifestyle.exercise || '');
        setDiet(p.lifestyle.diet || '');
        setPets(p.lifestyle.pets || '');
      }

      if (p.socialLinks) {
        setFacebook(p.socialLinks.facebook || '');
        setInstagram(p.socialLinks.instagram || '');
        setSnapchat(p.socialLinks.snapchat || '');
        setWhatsapp(p.socialLinks.whatsapp || '');
      }

      if (p.personalityAnswers && Array.isArray(p.personalityAnswers)) {
        const initialAnswers: Record<number, number> = {};
        p.personalityAnswers.forEach((ans: any) => {
          if (ans && typeof ans.questionNumber === 'number') {
            initialAnswers[ans.questionNumber] = ans.answer;
          }
        });
        setAnswers(initialAnswers);
      }

      if (p.interests && Array.isArray(p.interests)) {
        const ids = p.interests
          .map((i: any) => (typeof i === 'string' ? i : i?._id ? String(i._id) : ''))
          .filter(Boolean);
        setSelectedInterestIds(ids);
      }
    }
  }, [meData]);

  const effectiveCity = city === 'Other' ? customCity : city;
  const effectiveCountry = country === 'Other' ? customCountry : country;
  const effectiveOccupation = occupation === 'Other' ? customOccupation : occupation;
  const effectiveEducation = education === 'Other' ? customEducation : education;

  // Live Completion percentage calculation
  const calculateLiveCompletion = (): number => {
    let score = 0;
    if (bio && bio.trim().length >= 10) score += 5;
    if (effectiveCity && effectiveCountry) score += 5;
    if (effectiveOccupation && effectiveEducation) score += 5;
    if (age >= 18 && gender) score += 5;

    // Lifestyle choices
    if (smoking && drinking && exercise && diet && pets) score += 20;

    // Photos
    if (meData?.profile?.photos && Array.isArray(meData.profile.photos) && meData.profile.photos.length >= 1) {
      score += 15;
    }

    // Hobbies
    if (Array.isArray(selectedInterestIds) && selectedInterestIds.length >= 3) score += 20;

    // 50 Questions
    if (answers && typeof answers === 'object' && Object.keys(answers).length >= 50) score += 25;

    return Math.min(100, score);
  };

  const completionPercentage = calculateLiveCompletion();

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        bio,
        age,
        gender,
        city: effectiveCity,
        country: effectiveCountry,
        occupation: effectiveOccupation,
        education: effectiveEducation,
        lifestyle: {
          smoking: smoking || undefined,
          drinking: drinking || undefined,
          exercise: exercise || undefined,
          diet: diet || undefined,
          pets: pets || undefined,
        },
      }).unwrap();

      setSavedSuccessMessage('Profile details & lifestyle saved!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        socialLinks: {
          facebook: facebook || undefined,
          instagram: instagram || undefined,
          snapchat: snapchat || undefined,
          whatsapp: whatsapp || undefined,
        },
      }).unwrap();

      setSavedSuccessMessage('Social links saved!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const handleSavePersonality = async () => {
    const formattedAnswers = Object.entries(answers).map(([qNum, ans]) => ({
      questionNumber: parseInt(qNum, 10),
      answer: ans,
    }));

    try {
      await submitPersonality(formattedAnswers).unwrap();
      setSavedSuccessMessage('Personality questionnaire saved successfully!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const toggleInterest = (id: string) => {
    if (!id) return;
    if (selectedInterestIds.includes(id)) {
      setSelectedInterestIds(selectedInterestIds.filter((item) => item !== id));
    } else {
      setSelectedInterestIds([...selectedInterestIds, id]);
    }
  };

  const handleSaveInterests = async () => {
    try {
      await updateInterests(selectedInterestIds).unwrap();
      setSavedSuccessMessage('Hobbies updated!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const handleAddPhoto = async () => {
    if (!newPhotoUrl) return;
    try {
      await addPhoto(newPhotoUrl).unwrap();
      setNewPhotoUrl('');
      setSavedSuccessMessage('Photo added!');
      setTimeout(() => setSavedSuccessMessage(''), 3000);
      refetchMe();
    } catch (err) {}
  };

  const filteredInterests = (interestsData?.interests || []).filter((item: any) => {
    if (!item) return false;
    const nameStr = (item.name || '').toLowerCase();
    const catStr = (item.category || '').toLowerCase();
    const queryStr = (hobbySearch || '').toLowerCase();
    return nameStr.includes(queryStr) || catStr.includes(queryStr);
  });

  if (isMeLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-xs font-medium">Loading profile setup...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Completion Badge */}
      <div className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit tracking-tight">
                Edit Profile
              </h1>
              <Badge variant="rose" dot>Setup</Badge>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Reach 100% completion to unlock candidate discovery & matching algorithms.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg shadow-black/20">
            <div className="text-right">
              <span className="text-[10px] text-slate-300 block uppercase font-bold tracking-wider">Completion</span>
              <span className={`text-xl font-extrabold font-outfit ${completionPercentage === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {completionPercentage}% {completionPercentage === 100 ? '✓ Ready' : ''}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white">
              {completionPercentage}%
            </div>
          </div>
        </div>

        {savedSuccessMessage && (
          <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-pulse shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> {savedSuccessMessage}
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            { id: 'basic', label: 'Basic & Lifestyle', icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'social', label: 'Social Handles', icon: <Share2 className="w-3.5 h-3.5" /> },
            { id: 'interests', label: `Hobbies (${selectedInterestIds.length})`, icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'personality', label: `50 Qs (${Object.keys(answers).length}/50)`, icon: <ListChecks className="w-3.5 h-3.5" /> },
            { id: 'photos', label: 'Photos', icon: <Image className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isTabActive
                    ? 'bg-gradient-to-r from-rose-500/30 to-rose-600/30 text-white border border-rose-400/50 shadow-md backdrop-blur-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Basic & Lifestyle Choices */}
      {activeTab === 'basic' && (
        <form onSubmit={handleSaveBasic} className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white font-outfit">Basic Details & Lifestyle</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Bio / Story</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 rounded-xl border border-white/20 bg-black/40 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md transition-all shadow-inner"
              placeholder="Tell your future partner about your life, values, and lifestyle..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Age</label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                className="border-white/20 bg-black/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
              >
                <option value="">-- Select Country --</option>
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other / Custom Write-In</option>
              </select>
              {country === 'Other' && (
                <Input
                  type="text"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder="Enter country name..."
                  className="mt-2 border-white/20 bg-black/40"
                />
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
              >
                <option value="">-- Select City --</option>
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other / Custom Write-In</option>
              </select>
              {city === 'Other' && (
                <Input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="Enter city name..."
                  className="mt-2 border-white/20 bg-black/40"
                />
              )}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Occupation</label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
              >
                <option value="">-- Select Occupation --</option>
                {POPULAR_OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              {occupation === 'Other' && (
                <Input
                  type="text"
                  value={customOccupation}
                  onChange={(e) => setCustomOccupation(e.target.value)}
                  placeholder="Enter custom occupation..."
                  className="mt-2 border-white/20 bg-black/40"
                />
              )}
            </div>

            {/* Education */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Education</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
              >
                <option value="">-- Select Education --</option>
                {POPULAR_EDUCATION.map((ed) => (
                  <option key={ed} value={ed}>{ed}</option>
                ))}
              </select>
              {education === 'Other' && (
                <Input
                  type="text"
                  value={customEducation}
                  onChange={(e) => setCustomEducation(e.target.value)}
                  placeholder="Enter custom education..."
                  className="mt-2 border-white/20 bg-black/40"
                />
              )}
            </div>
          </div>

          {/* Lifestyle Attributes */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Lifestyle Attributes
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Smoking</label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
                >
                  <option value="">-- Select Smoking --</option>
                  <option value="Never">Never</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Drinking</label>
                <select
                  value={drinking}
                  onChange={(e) => setDrinking(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
                >
                  <option value="">-- Select Drinking --</option>
                  <option value="Never">Never</option>
                  <option value="Socially">Socially</option>
                  <option value="Regularly">Regularly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Exercise</label>
                <select
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
                >
                  <option value="">-- Select Exercise --</option>
                  <option value="Never">Never</option>
                  <option value="Sometimes">Sometimes</option>
                  <option value="Often">Often</option>
                  <option value="Daily">Daily</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Diet</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
                >
                  <option value="">-- Select Diet --</option>
                  <option value="Anything">Anything</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="Halal">Halal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pets Preference</label>
                <select
                  value={pets}
                  onChange={(e) => setPets(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:border-rose-500/60 backdrop-blur-md"
                >
                  <option value="">-- Select Pets --</option>
                  <option value="None">None</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                  <option value="Both">Both</option>
                  <option value="Lover">Pet Lover</option>
                </select>
              </div>
            </div>
          </div>

          <Button type="submit" variant="glow" size="lg" className="gap-2 text-xs font-bold px-8 shadow-lg shadow-rose-500/25">
            <Save className="w-4 h-4" /> Save Profile Details
          </Button>
        </form>
      )}

      {/* Tab 2: Optional Social Media Links */}
      {activeTab === 'social' && (
        <form onSubmit={handleSaveSocial} className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div>
            <h2 className="text-lg font-bold text-white font-outfit">Social Media Handles (Optional)</h2>
            <p className="text-xs text-slate-300 mt-1">
              Adding social links is optional. If added, matched users can connect with you directly.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Facebook Profile URL</label>
              <Input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/username"
                className="border-white/20 bg-black/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Instagram Username / Handle</label>
              <Input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className="border-white/20 bg-black/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Snapchat Username</label>
              <Input
                type="text"
                value={snapchat}
                onChange={(e) => setSnapchat(e.target.value)}
                placeholder="snap_username"
                className="border-white/20 bg-black/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">WhatsApp Number / Link</label>
              <Input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+1234567890"
                className="border-white/20 bg-black/40"
              />
            </div>
          </div>

          <Button type="submit" variant="glow" size="default" className="gap-2 text-xs font-bold shadow-lg shadow-rose-500/25">
            <Save className="w-4 h-4" /> Save Social Links
          </Button>
        </form>
      )}

      {/* Tab 3: Hobbies Selector */}
      {activeTab === 'interests' && (
        <div className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">Select at least 3 Hobbies</h2>
              <p className="text-xs text-slate-300">Select any hobbies below to automate Jaccard compatibility matching.</p>
            </div>
            <Button
              onClick={handleSaveInterests}
              variant="glow"
              size="default"
              className="gap-2 text-xs font-bold shadow-lg shadow-rose-500/25"
            >
              <Save className="w-4 h-4" /> Save Selected ({selectedInterestIds.length})
            </Button>
          </div>

          {/* Search Box */}
          <Input
            type="text"
            value={hobbySearch}
            onChange={(e) => setHobbySearch(e.target.value)}
            placeholder="Search hobbies (e.g., Tennis, Photography, Chess, Hiking)..."
            icon={<Search className="w-4 h-4" />}
            className="border-white/20 bg-black/40"
          />

          <div className="flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto pr-2">
            {filteredInterests.map((item: any) => {
              const itemId = String(item._id || item.id || '');
              const isSelected = selectedInterestIds.includes(itemId);
              return (
                <button
                  key={itemId || item.name}
                  type="button"
                  onClick={() => toggleInterest(itemId)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    isSelected
                      ? 'bg-rose-500/30 text-rose-200 border-rose-400/60 shadow-md shadow-rose-500/15 backdrop-blur-md'
                      : 'glass-container-card text-slate-300 border-white/15 hover:border-white/30 hover:text-white'
                  }`}
                >
                  #{item.name} <span className="text-[10px] opacity-70">({item.category})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: 50 Likert-Scale Personality Questions */}
      {activeTab === 'personality' && (
        <div className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white font-outfit">50 Personality Questions ({Object.keys(answers).length}/50)</h2>
              <p className="text-xs text-slate-300">Rate statements from 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
            </div>
            <Button
              onClick={handleSavePersonality}
              variant="glow"
              size="default"
              className="gap-2 text-xs font-bold shadow-lg shadow-rose-500/25"
            >
              <Save className="w-4 h-4" /> Save Answers
            </Button>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {(questionsData?.questions || []).map((q: any) => (
              <div key={q.questionNumber} className="p-4 rounded-2xl glass-container-card border border-white/15 space-y-3 shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-xs font-bold text-rose-400">Q{q.questionNumber}</span>
                  <p className="text-sm font-medium text-slate-100 flex-grow">{q.question}</p>
                  <span className="text-[10px] uppercase font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md">
                    {q.category}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 max-w-md mx-auto pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Disagree</span>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, [q.questionNumber]: val })}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        answers[q.questionNumber] === val
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/30 scale-105 border border-rose-400/40'
                          : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-400 font-medium">Agree</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Photo Gallery */}
      {activeTab === 'photos' && (
        <div className="rounded-3xl glass-container border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white font-outfit">Photo Gallery</h2>

          <div className="flex gap-2.5">
            <Input
              type="text"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="Paste image URL (Unsplash or Cloudinary)..."
              className="border-white/20 bg-black/40"
            />
            <Button
              onClick={handleAddPhoto}
              variant="glow"
              size="default"
              className="text-xs font-bold whitespace-nowrap shadow-lg shadow-rose-500/25"
            >
              Add Photo
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {meData?.profile?.photos?.map((photo: any, index: number) => (
              <div key={index} className="relative rounded-2xl overflow-hidden group border border-white/20 glass-container-card shadow-lg">
                <img src={photo.url} alt="Profile photo" className="w-full h-44 object-cover" />
                {photo.isMain && (
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-md">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
