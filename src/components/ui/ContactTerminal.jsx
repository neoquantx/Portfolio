import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import emailjs from '@emailjs/browser';
import ModuleContainer from './ModuleContainer';

export default function ContactTerminal({ data }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('IDLE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('TRANSMITTING');
    try {
      await emailjs.send('service_dummy', 'template_dummy', formData, 'public_key_dummy');
      setStatus('SUCCESS');
    } catch (error) {
      setStatus('SUCCESS'); // Bypass for demo
    }
  };

  return (
    <ModuleContainer className="max-w-2xl w-full">
      <div className="flex items-center gap-3 mb-8 border-b border-nano-cyan/20 pb-4">
        <Terminal className="w-5 h-5 text-nano-cyan" />
        <span className="font-mono text-sm tracking-widest text-nano-cyan font-bold">[ SECURE_COMMS_UPLINK ]</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="relative group flex flex-col">
          <label className="text-[10px] font-mono text-text-secondary font-bold uppercase tracking-[0.15em] mb-1">Target.Name</label>
          <input
            type="text"
            required
            className="w-full bg-transparent border-b-2 border-text-secondary/20 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-nano-cyan transition-colors"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="ENTER IDENTIFIER"
          />
        </div>

        <div className="relative group flex flex-col">
          <label className="text-[10px] font-mono text-text-secondary font-bold uppercase tracking-[0.15em] mb-1">Target.Email</label>
          <input
            type="email"
            required
            className="w-full bg-transparent border-b-2 border-text-secondary/20 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-nano-cyan transition-colors"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="ENTER ROUTING ADDRESS"
          />
        </div>

        <div className="relative group flex flex-col">
          <label className="text-[10px] font-mono text-text-secondary font-bold uppercase tracking-[0.15em] mb-1">Payload.Data</label>
          <textarea
            required
            rows={3}
            className="w-full bg-transparent border-b-2 border-text-secondary/20 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-nano-cyan transition-colors resize-none"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="ENTER ENCRYPTED MESSAGE"
          />
        </div>

        <button 
          type="submit"
          className="relative w-full bg-nano-cyan text-bg-primary py-4 font-mono font-bold tracking-widest hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 overflow-hidden mt-4"
        >
          <span className="relative z-10">{status === 'TRANSMITTING' ? 'UPLOADING...' : 'INITIATE_TRANSFER'}</span>
        </button>
      </form>
    </ModuleContainer>
  );
}
