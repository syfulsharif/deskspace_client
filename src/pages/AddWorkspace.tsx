import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, Image as ImageIcon, MapPin, Sparkles, Plus } from 'lucide-react';
import { api } from '../lib/api.js';
import { User } from '../types.js';
import { Button } from '../components/ui/Button.js';
import { Input, Textarea, Select } from '../components/ui/Input.js';

interface AddWorkspaceProps {
  user: User | null;
  navigate: (path: string) => void;
}

export function AddWorkspace({ user, navigate }: AddWorkspaceProps) {
  // Redirect unauthenticated users to login immediately
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState('coworking');
  const [pricePerHour, setPricePerHour] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  
  // Custom Amenities List
  const [amenityInput, setAmenityInput] = useState('');
  const [amenities, setAmenities] = useState<string[]>([
    '1Gbps Fiber WiFi',
    'Unlimited Espresso Coffee Bar',
    'Ergonomic Standing Desks'
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'coworking', label: 'Co-working Hot Desk' },
    { value: 'private_office', label: 'Private Office Suite' },
    { value: 'meeting_room', label: 'Meeting Boardroom' },
    { value: 'creative_studio', label: 'A/V & Photo Studio' },
  ];

  const handleAddAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!name || !shortDescription || !description || !pricePerHour || !location || !capacity) {
      setError('Please fill in all required fields.');
      return;
    }

    const price = Number(pricePerHour);
    const cap = Number(capacity);

    if (isNaN(price) || price < 0) {
      setError('Price per hour must be a valid positive number.');
      return;
    }

    if (isNaN(cap) || cap <= 0) {
      setError('Capacity must be a positive integer.');
      return;
    }

    setIsLoading(true);

    api.createWorkspace({
      name,
      category: category as any,
      pricePerHour: price,
      capacity: cap,
      location,
      image,
      shortDescription,
      description,
      amenities
    })
    .then((res) => {
      if (res.success && res.data) {
        setSuccess(true);
        // Clean form and redirect to Details Page in 1.5 seconds
        const newId = res.data.id;
        setTimeout(() => {
          navigate(`/workspace/${newId}`);
        }, 1500);
      } else {
        setError(res.error || 'Failed to list workspace.');
      }
      setIsLoading(false);
    })
    .catch((err) => {
      setError('Network connection error. Failed to post listing.');
      setIsLoading(false);
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
          <PlusCircle className="h-7 w-7 text-amber-600" /> Host & List Your Workspace
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Rent out your meeting spaces, hot desks, or sound-isolated photo and podcast studios to Seattle's elite remote work force.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="h-14 w-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-100">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900">Workspace Listed Successfully!</h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
              Your new co-working space listing is now live in the DeskSpace directory. Redirecting you to the dynamic listing page...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="name"
                label="Workspace Name"
                placeholder="e.g., Summit Hill Podcast Suite"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Select
                id="category"
                label="Workspace Environment Category"
                options={categories}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Price and Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="pricePerHour"
                label="Price Per Hour ($)"
                type="number"
                placeholder="e.g., 25"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                required
              />

              <Input
                id="capacity"
                label="Max Capacity (People)"
                type="number"
                placeholder="e.g., 6"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>

            {/* Location and Cover Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="location"
                label="Neighborhood Location"
                placeholder="e.g., Pioneer Square, Seattle, WA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <Input
                id="image"
                label="Cover Image URL (Optional)"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                helperText="Leave empty to use category default image."
              />
            </div>

            {/* Short Description */}
            <Input
              id="shortDescription"
              label="Brief Tagline / Short Description"
              placeholder="e.g., sound-insulated workspace featuring premium podcast gears and dynamic whiteboards."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              maxLength={120}
              required
              helperText="Maximum 120 characters for card grids."
            />

            {/* Full description */}
            <Textarea
              id="description"
              label="Detailed Workspace Description"
              placeholder="Provide a highly detailed overview describing your desk configurations, ambient lights, target audiences, and neighborhood access details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            {/* Amenities Checklist */}
            <div className="space-y-2 border-t border-zinc-100 pt-5">
              <label className="text-xs font-bold text-zinc-700 tracking-wide uppercase">Workspace Amenities Checklist</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., 4K Smart TV Projection"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <Button variant="outline" type="button" onClick={handleAddAmenity} className="flex items-center gap-1 text-xs shrink-0 py-2">
                  <Plus className="h-4 w-4" /> Add Spec
                </Button>
              </div>

              {/* Dynamic Amenities List */}
              <div className="flex flex-wrap gap-2 pt-2">
                {amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium rounded-full"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(idx)}
                      className="text-amber-500 hover:text-amber-800 font-extrabold focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate('/explore')}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" className="px-6 font-semibold" isLoading={isLoading}>
                Publish Workspace
              </Button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
