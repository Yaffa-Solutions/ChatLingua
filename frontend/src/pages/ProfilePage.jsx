import ProfileSetup from '../components/auth/ProfileSetup';

export default function ProfilePage({ onSubmit }) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 relative">
      <div className="relative z-10 w-full">
        <ProfileSetup onSubmit={onSubmit} />
      </div>
    </div>
  );
}
