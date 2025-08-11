import React from 'react'

function CreatorDashboardHeader() {
  return (
   
    <section id="hero" class="bg-gradient-to-br #610bee to-purple-800 text-white py-16 md:py-24 px-6 md:px-12 relative h-[600px] overflow-hidden" style={{background:'#610bee'}}>
        <div class="absolute inset-0 ">
            <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/4d1f2766e2-83f81587e205953f83de.png" alt="abstract 3D CAD wireframe designs and models with purple gradient background"/>
        </div>
        <div class="max-w-6xl mx-auto relative z-10">
            <div class="md:w-3/5">
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Publish. Earn. Inspire.</h1>
                <p class="text-xl md:text-2xl mb-8 text-purple-100">Monetize your CAD files or share them with the open-source hardware community.</p>
                <div class="flex flex-col sm:flex-row gap-4">
                    <span style={{ color: '#610BEE' }} class="bg-white text-purple-10 hover:bg-gray-100 py-3 px-8 rounded-md font-semibold text-lg transition duration-300 text-center cursor-pointer">Create My Profile</span>
                    <span class="bg-transparent border-2 border-white text-white hover:bg-white/10 py-3 px-8 rounded-md font-semibold text-lg transition duration-300 text-center cursor-pointer">Already have files? Start Uploading</span>
                </div>
            </div>
        </div>
    </section>

   
  )
}

export default CreatorDashboardHeader