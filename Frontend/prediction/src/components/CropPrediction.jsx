import React, { useState } from 'react';

const CropPrediction = () => {
    const [formData, setFormData] = useState({
        location: '',
        soilColor: '',
        rainfallDate: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Prediction Data:', formData);
        alert('Data logged to console! (Simulating prediction)');
        // Integrating ML backend would happen here
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-tight">
                Crop Prediction
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Location & Basic Info */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <span className="bg-green-500 w-2 h-6 rounded-full"></span>
                        Location Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 block">Location</label>
                            <input
                                required
                                type="text"
                                name="location"
                                placeholder="Enter your location"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none bg-white"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-600 block">Soil Color</label>
                            <select
                                required
                                name="soilColor"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none bg-white"
                                value={formData.soilColor}
                                onChange={handleChange}
                            >
                                <option value="">Select Color</option>
                                <option value="Black">Black</option>
                                <option value="Red">Red</option>
                                <option value="Brown">Brown</option>
                                <option value="Sandy">Sandy</option>
                                <option value="Clay">Clay</option>
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-gray-600 block">Last Date of Rainfall</label>
                            <input
                                required
                                type="date"
                                name="rainfallDate"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all outline-none bg-white placeholder-gray-400"
                                value={formData.rainfallDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Soil & Weather Parameters */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <span className="bg-blue-500 w-2 h-6 rounded-full"></span>
                        Soil & Weather Parameters
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { label: 'Nitrogen (N)', name: 'nitrogen', min: 0, max: 140 },
                            { label: 'Phosphorus (P)', name: 'phosphorus', min: 5, max: 145 },
                            { label: 'Potassium (K)', name: 'potassium', min: 5, max: 205 },
                            { label: 'Temperature (°C)', name: 'temperature', min: 10, max: 50 },
                            { label: 'Humidity (%)', name: 'humidity', min: 15, max: 100 },
                            { label: 'pH Level', name: 'ph', min: 3.5, max: 9.0, step: 0.1 },
                            { label: 'Rainfall (mm)', name: 'rainfall', min: 20, max: 300 },
                        ].map((field) => (
                            <div key={field.name} className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-medium text-gray-600">{field.label}</label>
                                    <span className="text-xs text-gray-400">Range: {field.min} - {field.max}</span>
                                </div>
                                <input
                                    required
                                    type="number"
                                    name={field.name}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step || 1}
                                    placeholder={field.min}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none bg-white appearance-none"
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
                >
                    Predict Crop
                </button>
            </form>
        </div>
    );
};

export default CropPrediction;
