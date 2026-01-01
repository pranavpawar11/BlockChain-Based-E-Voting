import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 transform hover:-translate-y-1"
          >
            {/* Centered Content */}
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className={`${stat.iconBg} w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${stat.iconColor}`} />
              </div>
              
              {/* Badge (if exists) */}
              {stat.badge && (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold mb-2 ${stat.badge.className}`}>
                  {stat.badge.text}
                </span>
              )}
              
              {/* Label */}
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
                {stat.label}
              </p>
              
              {/* Value */}
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {stat.value}
              </p>
              
              {/* Subtitle (if exists) */}
              {stat.subtitle && (
                <p className="text-xs text-gray-500 mt-2">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;