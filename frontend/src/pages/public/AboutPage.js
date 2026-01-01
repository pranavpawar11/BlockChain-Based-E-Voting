import React from 'react';
import { Shield, Lock, Eye, CheckCircle, Users, Vote } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
            <Vote className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            About Blockchain Ballotbox
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing democracy through blockchain technology
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Blockchain Ballotbox is dedicated to transforming the voting experience by leveraging blockchain technology 
            to ensure security, transparency, and trust in every election. We believe that voting should be accessible, 
            verifiable, and tamper-proof.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our platform combines cutting-edge blockchain technology with user-friendly design to create a voting 
            system that is not only secure but also easy to use for everyone, from voters to administrators.
          </p>
        </div>

        {/* Why Blockchain Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Blockchain for Voting?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Immutable Records</h3>
                  <p className="text-gray-600">
                    Once a vote is recorded on the blockchain, it cannot be altered or deleted, ensuring the integrity of every election.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Transparency</h3>
                  <p className="text-gray-600">
                    All transactions are visible on the blockchain, allowing anyone to verify election results while maintaining voter anonymity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enhanced Security</h3>
                  <p className="text-gray-600">
                    Blockchain's decentralized nature makes it virtually impossible for hackers to manipulate election results.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Verification</h3>
                  <p className="text-gray-600">
                    Voters receive instant confirmation with transaction hashes, providing proof that their vote was counted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">How Our System Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white text-blue-600 font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">User Registration & Verification</h3>
                <p className="text-blue-100">
                  Users register with their information and upload identification documents. Administrators verify each user 
                  to ensure only eligible voters can participate.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white text-purple-600 font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Election Creation</h3>
                <p className="text-blue-100">
                  Administrators create elections, add candidates, set voting periods, and manage all aspects of the election process.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white text-blue-600 font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Secure Voting</h3>
                <p className="text-blue-100">
                  Verified voters select their candidates during the active voting period. Each vote is encrypted and 
                  recorded on the blockchain with a unique transaction hash.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white text-purple-600 font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Real-Time Results</h3>
                <p className="text-blue-100">
                  Results are calculated automatically and displayed in real-time. Every vote can be verified on the 
                  blockchain, ensuring complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">Blockchain-verified vote recording</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">Anonymous and private voting</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">Real-time result tracking</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">Comprehensive admin dashboard</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">User verification system</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">Multi-candidate elections</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">Transaction hash confirmation</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <span className="text-gray-700">Responsive and modern UI</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our platform today and experience the future of democratic voting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/register'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Register as Voter
            </button>
            <button
              onClick={() => window.location.href = '/register-admin'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Register as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;