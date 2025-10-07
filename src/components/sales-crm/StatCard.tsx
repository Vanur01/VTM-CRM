import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  bgColor?: string;
  textColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  bgColor = "bg-white",
  textColor = "text-gray-800",
}) => {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-md border border-gray-200`}>
      <h3 className={`text-sm font-medium ${textColor} mb-2`}>{title}</h3>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
};

export default StatCard;