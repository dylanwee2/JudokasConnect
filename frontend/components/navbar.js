export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container lg mx-8">
        <div className="flex justify-between h-16 items-center">

          <div className="flex items-center space-x-8">
            <a href="#"><img src="/judokaslogo.jpg" className="h-8 w-8 rounded-full" /></a>
            <a href="/" className="text-xl font-bold text-gray-800">JudokasConnect</a>
            <div className="hidden md:flex space-x-6">
              <a href="/signup" className="text-gray-600 hover:text-blue-600">Home</a>
              <a href="/login" className="text-gray-600 hover:text-blue-600">Training Sessions</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#"><img src="/profile.svg" className="h-8 w-8 rounded-full" /></a>
          </div>

        </div>
      </div>
    </nav>
  );
}