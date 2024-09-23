import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Doctor.css';
import placeholderImage from '../images/default.jpg';
import { FaMapMarkerAlt, FaClinicMedical, FaUserMd } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [nameSuggestions, setNameSuggestions] = useState([]);
    const [specialitySuggestions, setSpecialitySuggestions] = useState([]);
    const [clinicNameSuggestions, setClinicNameSuggestions] = useState([]);
    const [filters, setFilters] = useState({ name: '', speciality: '', clinic_name: '' });
    const [selectedLetter, setSelectedLetter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    const navigate = useNavigate();
    const location = useLocation();

    const specialityRef = useRef(null);
    const clinicRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page'), 10) || 1;
        setCurrentPage(page);

        loadDoctors();
    }, [location.search]);

    useEffect(() => {
        applyFilters();
    }, [filters, selectedLetter, doctors]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (specialityRef.current && !specialityRef.current.contains(event.target)) {
                setSpecialitySuggestions([]);
            }
            if (clinicRef.current && !clinicRef.current.contains(event.target)) {
                setClinicNameSuggestions([]);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setSpecialitySuggestions([]);
                setClinicNameSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });

        if (name === 'name' && value) {
            const suggestions = [...new Set(doctors
                .filter(doctor => doctor.name.toLowerCase().startsWith(value.toLowerCase()))
                .map(doctor => doctor.name.toUpperCase()))];
            setNameSuggestions(suggestions);
        } else if (name === 'speciality') {
            if (value === '') {
                const uniqueSpecialties = [...new Set(doctors.map(doctor => doctor.speciality.toUpperCase()))];
                setSpecialitySuggestions(uniqueSpecialties);
            } else {
                const suggestions = [...new Set(doctors
                    .filter(doctor => doctor.speciality.toLowerCase().startsWith(value.toLowerCase()))
                    .map(doctor => doctor.speciality.toUpperCase()))];
                setSpecialitySuggestions(suggestions);
            }
        } else if (name === 'clinic_name') {
            if (value === '') {
                const uniqueClinics = [...new Set(doctors.map(doctor => doctor.clinic_name.toUpperCase()))];
                setClinicNameSuggestions(uniqueClinics);
            } else {
                const suggestions = [...new Set(doctors
                    .filter(doctor => doctor.clinic_name.toLowerCase().startsWith(value.toLowerCase()))
                    .map(doctor => doctor.clinic_name.toUpperCase()))];
                setClinicNameSuggestions(suggestions);
            }
        } else {
            setNameSuggestions([]);
            setSpecialitySuggestions([]);
            setClinicNameSuggestions([]);
        }
    };

    const handleSpecialityInputClick = () => {
        if (filters.speciality === '') {
            const uniqueSpecialties = [...new Set(doctors.map(doctor => doctor.speciality.toUpperCase()))];
            setSpecialitySuggestions(uniqueSpecialties);
        }
    };

    const handleClinicInputClick = () => {
        if (filters.clinic_name === '') {
            const uniqueClinics = [...new Set(doctors.map(doctor => doctor.clinic_name.toUpperCase()))];
            setClinicNameSuggestions(uniqueClinics);
        }
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
        e.target.src = placeholderImage;
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        navigate(`?page=${pageNumber}`);
    };

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
                    <div className="input-container" ref={specialityRef}>
                        <input 
                            type="text" 
                            placeholder="Type of Speciality" 
                            name="speciality" 
                            value={filters.speciality} 
                            onChange={handleFilterChange}
                            onClick={handleSpecialityInputClick} 
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
                    <div className="input-container" ref={clinicRef}>
                        <input 
                            type="text" 
                            placeholder="Clinic's Name" 
                            name="clinic_name" 
                            value={filters.clinic_name} 
                            onChange={handleFilterChange} 
                            onClick={handleClinicInputClick} 
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
                            <Link to={`/doctor/${doctor.id}?page=${currentPage}`}>{doctor.name.toUpperCase()}</Link>
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
