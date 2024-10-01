import { Outlet } from "react-router-dom"
import NavBar from "../components/headers/NavBar"
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const MainLayout = () => {
  return (
    <main className = "dark:bg-black overflow-hidden">
        <NavBar/>
        <Outlet/>
        <footer className="bg-white text-gray-800 py-12 px-6 mt-auto border-t-2 border-gray-300">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-bold text-lg mb-4">Contact Us</h2>
            <p className="text-sm"> Monplaisir, Tunis, Tunis</p>
            <p className="text-sm">Phone: +1 234 567 890</p>
            <p className="text-sm">Email: cdc@ourcompany.com</p>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-bold text-lg mb-4">Quick Links</h2>
            <a href="/" className="text-sm hover:text-red-500 transition duration-300">Home</a>
            <a href="#" className="text-sm hover:text-red-500 transition duration-300">About Us</a>
            <a href="#" className="text-sm hover:text-red-500 transition duration-300">Services</a>
            <a href="#" className="text-sm hover:text-red-500 transition duration-300">Contact</a>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-bold text-lg mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-red-500 transition duration-300">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-red-500 transition duration-300">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-red-500 transition duration-300">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-red-500 transition duration-300">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

        
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </main>
  )
}

export default MainLayout