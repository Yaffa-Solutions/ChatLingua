import ProfileSetup from '../components/auth/ProfileSetup';
import ParticleBackground from '../components/ui/ParticleBackground';

export default function ProfilePage({ onSubmit }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-dark-400 to-accent/5" />
      <div className="relative z-10 w-full">
        <ProfileSetup onSubmit={onSubmit} />
      </div>
    </div>
  );
}
