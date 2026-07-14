import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, HelpCircle } from 'lucide-react';
import { api } from '../lib/api.js';
import { Button } from '../components/ui/Button.js';
import { Input, Textarea } from '../components/ui/Input.js';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name || !email || !subject || !message) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    api.submitContactForm({ name, email, subject, message })
      .then((res) => {
        if (res.success && res.data) {
          setSuccessMessage(res.data.message);
          // Clean inputs
          setName('');
          setEmail('');
          setSubject('');
          setMessage('');
        } else {
          setError(res.error || 'Failed to submit form. Please try again.');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError('Network error. Failed to send message.');
        setIsLoading(false);
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Contact DeskSpace Support</h1>
        <p className="text-sm text-zinc-500">
          Have an inquiry about hosting, listing a space, corporate team reservations, or billing? Reach out to our Seattle leads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* Contact Info Sidebar Column (4 columns) */}
        <div className="lg:col-span-5 bg-zinc-900 text-white rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">Get in Touch</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              We respond to all verified emails and dashboard support tickets within 24 business hours. If you are locked out of a workspace or need immediate arrival support, please call our 24/7 hotline.
            </p>

            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3 text-zinc-300">
                <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Seattle HQ Office</strong><br />
                  1200 Pine Street, Pike Place Market,<br />
                  Seattle, WA 98101
                </span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <Mail className="h-5 w-5 text-amber-500 shrink-0" />
                <a href="mailto:support@deskspace.com" className="hover:text-amber-400 transition-colors">support@deskspace.com</a>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <Phone className="h-5 w-5 text-amber-500 shrink-0" />
                <a href="tel:+12065550189" className="hover:text-amber-400 transition-colors">+1 (206) 555-0189</a>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-500">
            © DeskSpace support team. Standard office hours are Mon–Fri, 8 AM to 6 PM PST.
          </div>
        </div>

        {/* Contact Form Column (7 columns) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-xs">
          {successMessage ? (
            <div className="text-center py-12 space-y-4">
              <div className="h-14 w-14 bg-amber-50 text-amber-600 border border-amber-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Message Received!</h3>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto">
                {successMessage}
              </p>
              <Button variant="outline" size="sm" onClick={() => setSuccessMessage(null)} className="mt-2">
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">Send Support Request</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="name"
                  label="Your Name"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Input
                id="subject"
                label="Topic Subject"
                placeholder="e.g., Question about Starlight Recording Studio gear"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <Textarea
                id="message"
                label="Your Detailed Inquiry"
                placeholder="Provide a detailed message describing your needs..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              {error && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="secondary" className="px-6 flex items-center gap-2 font-semibold" isLoading={isLoading}>
                  <Send className="h-4 w-4" /> Send Inquiry
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
