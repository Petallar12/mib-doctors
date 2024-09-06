import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Doctor.css';
import placeholderImage from '../images/default.jpg'; // This is the local placeholder image
import { FaMapMarkerAlt, FaClinicMedical, FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [nameSuggestions, setNameSuggestions] = useState([]);
    const [specialitySuggestions, setSpecialitySuggestions] = useState([]);
    const [clinicNameSuggestions, setClinicNameSuggestions] = useState([]);
    const [filters, setFilters] = useState({ name: '', speciality: '', clinic_name: '' });
    const [selectedLetter, setSelectedLetter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8); // Default items per page

    useEffect(() => {
        loadDoctors();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, selectedLetter, doctors]);

    const loadDoctors = async () => {
        try {
            const result = await axios.get('https://backend-doctor.vercel.app/doctors');
            setDoctors(result.data);
            setFilteredDoctors(result.data);
        } catch (error) {
            console.error('Failed to load doctors:', error);
        }
    };

    const applyFilters = () => {
        let updatedDoctors = doctors;

        if (filters.name) {
            updatedDoctors = updatedDoctors.filter(doctor =>
                doctor.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }

        if (filters.speciality) {
            updatedDoctors = updatedDoctors.filter(doctor =>
                doctor.speciality.toLowerCase().includes(filters.speciality.toLowerCase())
            );
        }

        if (filters.clinic_name) {
            updatedDoctors = updatedDoctors.filter(doctor =>
                doctor.clinic_name.toLowerCase().includes(filters.clinic_name.toLowerCase())
            );
        }

        if (selectedLetter) {
            updatedDoctors = updatedDoctors.filter(doctor => {
                const nameWithoutPrefix = doctor.name.replace(/^Dr\s+/i, '');
                return nameWithoutPrefix.toLowerCase().startsWith(selectedLetter.toLowerCase());
            });
        }

        setFilteredDoctors(updatedDoctors);
        setCurrentPage(1); // Reset to the first page when filters are applied
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    
        if (name === 'name' && value) {
            const suggestions = [...new Set(doctors
                .filter(doctor => doctor.name.toLowerCase().includes(value.toLowerCase()))
                .map(doctor => doctor.name.toUpperCase()))];
            setNameSuggestions(suggestions);
        } else if (name === 'speciality' && value) {
            // Filter specialties based on the input value
            const uniqueSpecialties = [...new Set(doctors
                .map(doctor => doctor.speciality.toUpperCase())
                .filter(speciality => speciality.includes(value.toUpperCase())))];
            setSpecialitySuggestions(uniqueSpecialties);
        } else if (name === 'clinic_name' && value) {
            const suggestions = [...new Set(doctors
                .filter(doctor => doctor.clinic_name.toLowerCase().includes(value.toLowerCase()))
                .map(doctor => doctor.clinic_name.toUpperCase()))];
            setClinicNameSuggestions(suggestions);
        } else {
            setNameSuggestions([]);
            setSpecialitySuggestions([]);
            setClinicNameSuggestions([]);
        }
    };

    // Set unique specialties on input click
    const handleSpecialityInputClick = () => {
        const uniqueSpecialties = [...new Set(doctors.map(doctor => doctor.speciality.toUpperCase()))];
        setSpecialitySuggestions(uniqueSpecialties);
    };

    const handleSuggestionClick = (suggestion, type) => {
        setFilters({ ...filters, [type]: suggestion });
        setNameSuggestions([]);
        setSpecialitySuggestions([]);
        setClinicNameSuggestions([]);
    };

    const handleLetterClick = (letter) => {
        setSelectedLetter(letter);
        setNameSuggestions([]);
        setSpecialitySuggestions([]);
        setClinicNameSuggestions([]);
    };

    const handleImageError = (e) => {
        e.target.src = placeholderImage; // If an image fails to load, show the placeholder
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page when items per page changes
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate pagination variables
    const indexOfLastDoctor = currentPage * itemsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage;
    const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

    return (
        <div className="container">
            <center><h1>List of Doctors</h1></center>
            <div className="filter-box">
                <div className="filter-container">
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Doctor's Name" 
                            name="name" 
                            value={filters.name} 
                            onChange={handleFilterChange} 
                        />
                        {nameSuggestions.length > 0 && (
                            <ul className="suggestions">
                                {nameSuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion, 'name')}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Type of Speciality" 
                            name="speciality" 
                            value={filters.speciality} 
                            onChange={handleFilterChange}
                            onClick={handleSpecialityInputClick} // Show unique specialties on click
                        />
                        {specialitySuggestions.length > 0 && (
                            <ul className="suggestions">
                                {specialitySuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion, 'speciality')}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Clinic's Name" 
                            name="clinic_name" 
                            value={filters.clinic_name} 
                            onChange={handleFilterChange} 
                        />
                        {clinicNameSuggestions.length > 0 && (
                            <ul className="suggestions">
                                {clinicNameSuggestions.map((suggestion, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(suggestion, 'clinic_name')}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="alphabet-filter">
    <button onClick={() => handleLetterClick('')}>All</button>
    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
        <button key={letter} onClick={() => handleLetterClick(letter)}>{letter}</button>
    ))}
</div>
                <div className="show-dropdown-container">
                    <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value={8}>8</option>
                        <option value={16}>16</option>
                        <option value={filteredDoctors.length}>All</option>
                    </select>
                </div>
            </div>

            <div className="doctor-container">
                {currentDoctors.map(doctor => (
                    <div className="doctor-box" key={doctor.id}>
                        <div className="photo-box">
                            <img 
                                src={doctor.image_url ? `${process.env.PUBLIC_URL}/images/${doctor.image_url}` : placeholderImage} 
                                alt={`${doctor.name}'s Photo`} 
                                onError={handleImageError} 
                            />
                        </div>
                        <h3>
                            <Link to={`/doctor/${doctor.id}`}>{doctor.name.toUpperCase()}</Link>
                        </h3>
                        {doctor.speciality && <p><FaUserMd /> {doctor.speciality}</p>}
                        {doctor.clinic_name && <p><FaClinicMedical /> {doctor.clinic_name}</p>}
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination-buttons">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button 
                            key={index + 1} 
                            onClick={() => handlePageChange(index + 1)} 
                            className={currentPage === index + 1 ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Doctor;
