import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Vacancy.css"; // Yeni CSS faylını import edirik

// Mock data, sonradan API-dan gələcək
const initialVacancies = [
  {
    id: 1,
        title: "Elektroenergetika sahəsi üzrə mühəndis",
        company: "Azərelektrik Tikinti Quraşdırma MMC",
        isPremium: true,
        views: 424,
        posted: "Bu gün",
        postedDate: new Date('2024-07-29T10:00:00'),
        category: "Mühəndislik",
        experienceLevel: "3-5 il",
        salary: 2500,
        location: "Bakı",
        employmentType: "Tam ştat",
        deadline: "2025-07-21",
        jobDescription: {
            conditions: [
                "Ünvan: Nəsimi rayonu, Rövşən Cəfərov küçəsi, 17",
                "Əmək haqqı – bilik və bacarıqlara uyğun olaraq razılaşma əsasında təyin olunacaq",
            ],
    requirements: [
                "Təhsil – Energetika mühəndisliyi və ya aidiyyatı sahə üzrə ali təhsil",
                "İş təcrübəsi – 35/110/330/500 kV elektrik xəttlərinin çəkilməsi üzrə minimum 3 il",
    ],
        },
        aboutCompany: "Azərelektrik Tikinti Quraşdırma MMC etibarlı və böyüməkdə olan bir şirkətdir. Biz innovativ texnologiyalardan istifadə edərək ölkənin enerji infrastrukturunu gücləndiririk.",
        contact: "Tel: (010) 253 47 77 / (051) 215 55 00",
        verified: true,
  },
  {
    id: 2,
        title: "Qrafik Dizayner üzrə Təqaüdlü Təlim Proqramı",
        company: "Vision Academy",
        isPremium: true,
        views: 684,
        posted: "Bu gün",
        postedDate: new Date('2024-07-29T12:30:00'),
        category: "Dizayn",
        experienceLevel: "Təcrübə tələb olunmur",
        salary: 500,
        location: "Bakı",
        employmentType: "Təcrübə proqramı",
        deadline: "2025-08-01",
        jobDescription: {
            conditions: ["Ofis daxili iş qrafiki.", "Peşəkar inkişaf imkanları."],
            requirements: ["Adobe Photoshop, Illustrator proqramlarında işləmək bacarığı.", "Kreativ düşüncə və portfolio."]
        },
        aboutCompany: "Vision Academy ölkənin qabaqcıl təhsil mərkəzlərindən biridir. Biz istedadlı gənclərə karyera qurmaq üçün şərait yaradırıq.",
        contact: "Email: hr@vision.az",
        verified: false,
  },
  {
    id: 3,
        title: "Backend Developer",
        company: "Tech Solutions",
        isPremium: false,
        views: 312,
        posted: "Dünən",
        postedDate: new Date('2024-07-28T15:00:00'),
        category: "IT/Proqramlaşdırma",
        experienceLevel: "1-3 il",
        salary: 1800,
        location: "Gəncə",
        employmentType: "Tam ştat",
        deadline: "2025-07-30",
        jobDescription: {
            conditions: ["Hibrid iş qrafiki.", "Rəqabətcil əmək haqqı və bonuslar."],
            requirements: ["Node.js, Python və ya Java ilə ən az 2 il təcrübə.", "SQL və NoSQL verilənlər bazaları ilə işləmə bacarığı."]
        },
        aboutCompany: "Tech Solutions müasir proqram təminatları hazırlayan innovativ bir şirkətdir.",
        contact: "Web: techsolutions.com/careers",
        verified: true,
    }
];

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };
    return [storedValue, setValue];
};

const Vacancy = () => {
    const [vacancies, setVacancies] = useState(initialVacancies);
    const [selectedVacancy, setSelectedVacancy] = useState(initialVacancies[2]);
    const [activeTab, setActiveTab] = useState('description');
    const [favorites, setFavorites] = useLocalStorage('vacancy_favorites', []);
    const [applied, setApplied] = useLocalStorage('vacancy_applied', []);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [isFilterAreaOpen, setIsFilterAreaOpen] = useState(false);
    const [filters, setFilters] = useState({
        elanlar: 'all',
        yerlesdirilib: 'all',
        siralama: 'default',
        vezife: 'all',
        maas: 'all',
        erazi: 'all',
        mesgulluq: 'all'
    });

    const handleFavoriteToggle = (id) => {
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    const handleApply = (id) => {
        if (applied.includes(id)) return;
        setApplied(prev => [...prev, id]);
        alert(`'${selectedVacancy.title}' vakansiyasına müraciətiniz uğurla göndərildi!`);
    };
    
    const handlePrint = () => {
        window.print();
    };

    const handleReport = () => {
        const reason = prompt("Şikayətinizin səbəbini qısaca yazın:");
        if (reason) {
            alert("Şikayətiniz qəbul olundu. Təşəkkür edirik!");
        }
    };

    const handleCategoryClick = (category) => {
        setCategoryFilter(category === categoryFilter ? null : category);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const allCategories = useMemo(() => 
        [...new Set(initialVacancies.map(v => v.category))]
    , []);

    const filteredVacancies = useMemo(() => {
        let result = vacancies.filter(v => {
            const searchMatch = searchTerm === "" || 
                v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.company.toLowerCase().includes(searchTerm.toLowerCase());
            
            const categoryMatch = categoryFilter ? v.category === categoryFilter : true;

            const elanlarMatch = filters.elanlar === 'all' || (filters.elanlar === 'premium' && v.isPremium) || (filters.elanlar === 'simple' && !v.isPremium);
            
            const yerlesdirilibMatch = (() => {
                if (filters.yerlesdirilib === 'all') return true;
                const postedDate = new Date(v.postedDate);
                const now = new Date();
                const diffTime = Math.abs(now - postedDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (filters.yerlesdirilib === '24saat') return diffDays <= 1;
                if (filters.yerlesdirilib === '3gun') return diffDays <= 3;
                if (filters.yerlesdirilib === '7gun') return diffDays <= 7;
                return true;
            })();

            const vezifeMatch = filters.vezife === 'all' || v.experienceLevel === filters.vezife;
            
            const maasMatch = (() => {
                if (filters.maas === 'all') return true;
                const [min, max] = filters.maas.split('-').map(Number);
                if (max) return v.salary >= min && v.salary <= max;
                return v.salary >= min; // For cases like "3000+"
            })();

            const eraziMatch = filters.erazi === 'all' || v.location === filters.erazi;
            const mesgulluqMatch = filters.mesgulluq === 'all' || v.employmentType === filters.mesgulluq;

            return searchMatch && categoryMatch && elanlarMatch && yerlesdirilibMatch && vezifeMatch && maasMatch && eraziMatch && mesgulluqMatch;
        });

        // Sorting
        switch (filters.siralama) {
            case 'date_desc':
                result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
                break;
            case 'salary_asc':
                result.sort((a, b) => a.salary - b.salary);
                break;
            case 'salary_desc':
                result.sort((a, b) => b.salary - a.salary);
                break;
            default:
                break;
        }

        return result;
    }, [searchTerm, vacancies, categoryFilter, filters]);

    useEffect(() => {
        if (filteredVacancies.length > 0 && !filteredVacancies.find(v => v.id === selectedVacancy?.id)) {
            setSelectedVacancy(filteredVacancies[0]);
        } else if (filteredVacancies.length === 0) {
            setSelectedVacancy(null);
        }
    }, [filteredVacancies, selectedVacancy?.id]);

    const renderDetailContent = () => {
        if (!selectedVacancy) return null;
        if (activeTab === 'description') {
            return (
                <div className="fade-in">
                    <h4>İş şəraiti:</h4>
                    <ul>{selectedVacancy.jobDescription.conditions.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    <h4>Namizədə tələblər:</h4>
                    <ul>{selectedVacancy.jobDescription.requirements.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    <p>Maraqlanan şəxslər elektron poçt ünvanına CV-lərini göndərə bilərlər.</p>
                    <p>Əlaqə üçün: <strong>{selectedVacancy.contact}</strong></p>
                </div>
            );
        }
        if (activeTab === 'company') {
            return (
                <div className="fade-in">
                    <h4>Şirkət Haqqında</h4>
                    <p>{selectedVacancy.aboutCompany}</p>
                </div>
            );
        }
    };

  return (
        <div className="vacancy-page-container">
            <div className="vacancy-list-panel">
                <div className="search-bar-container">
                    {isFilterAreaOpen ? (
                        <div className="advanced-search-panel">
                            <div className="advanced-search-header">
                                <svg className="search-icon-input" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                                <input 
                                    type="text"
                                    placeholder="Sayt üzrə axtarış"
                                    className="advanced-search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                                <button className="close-filter-button" onClick={() => setIsFilterAreaOpen(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
                                    Bağla
                                </button>
                            </div>
                            <div className="filter-grid">
                                <div className="filter-select-wrapper">
                                    <select name="elanlar" value={filters.elanlar} onChange={handleFilterChange} className="filter-select">
                                        <option value="all">Bütün elanlar</option>
                                        <option value="premium">Premium</option>
                                        <option value="simple">Sadə</option>
                                    </select>
                                </div>
                                <div className="filter-select-wrapper">
                                    <select name="yerlesdirilib" value={filters.yerlesdirilib} onChange={handleFilterChange} className="filter-select">
                                        <option value="all">Bütün tarix</option>
                                        <option value="24saat">Son 24 saat</option>
                                        <option value="3gun">Son 3 gün</option>
                                        <option value="7gun">Son 7 gün</option>
                                    </select>
                                </div>
                                <div className="filter-select-wrapper">
                                    <select name="siralama" value={filters.siralama} onChange={handleFilterChange} className="filter-select">
                                        <option value="default">Sıralama</option>
                                        <option value="date_desc">Tarixə görə (yeni)</option>
                                        <option value="salary_asc">Maaşa görə (artan)</option>
                                        <option value="salary_desc">Maaşa görə (azalan)</option>
                                    </select>
                                </div>
                                <div className="filter-select-wrapper">
                                     <select name="vezife" value={filters.vezife} onChange={handleFilterChange} className="filter-select">
                                        <option value="all">Vəzifə dərəcəsi</option>
                                        <option value="Təcrübə tələb olunmur">Təcrübə tələb olunmur</option>
                                        <option value="1-3 il">1-3 il</option>
                                        <option value="3-5 il">3-5 il</option>
                                        <option value="5 ildən çox">5 ildən çox</option>
                                    </select>
                                </div>
                                <div className="filter-select-wrapper">
                                    <select name="maas" value={filters.maas} onChange={handleFilterChange} className="filter-select">
                                        <option value="all">Maaş</option>
                                        <option value="0-1000">0 - 1000 AZN</option>
                                        <option value="1000-2000">1000 - 2000 AZN</option>
                                        <option value="2000-3000">2000 - 3000 AZN</option>
                                        <option value="3000">3000+ AZN</option>
                                    </select>
                                </div>
                                <div className="filter-select-wrapper">
                                    <select name="erazi" value={filters.erazi} onChange={handleFilterChange} className="filter-select">
                                        <option value="all">Ərazi</option>
                                        <option value="Bakı">Bakı</option>
                                        <option value="Sumqayıt">Sumqayıt</option>
                                        <option value="Gəncə">Gəncə</option>
                                    </select>
                                </div>
                                <div className="filter-select-wrapper">
                                    <select name="mesgulluq" value={filters.mesgulluq} onChange={handleFilterChange} className="filter-select">
                                        <option value="all">Məşğulluq növü</option>
                                        <option value="Tam ştat">Tam ştat</option>
                                        <option value="Yarım ştat">Yarım ştat</option>
                                        <option value="Təcrübə proqramı">Təcrübə proqramı</option>
                                        <option value="Frilans">Frilans</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="top-search-bar">
                            <span className="search-bar-title">Sayt üzrə axtarış</span>
                            <div className="search-bar-controls">
                                <button className="icon-button" aria-label="Axtarış" onClick={() => setIsFilterAreaOpen(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                                </button>
                                <button className="filter-button" onClick={() => setIsFilterAreaOpen(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>
                                    Filterlər
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {categoryFilter && !isFilterAreaOpen && (
                    <div className="active-filters-container">
                        <div className="filter-pill">
                            <span>{categoryFilter}</span>
                            <button onClick={() => setCategoryFilter(null)} title="Filtri təmizlə">×</button>
                        </div>
                    </div>
                )}
                
                <div className="vacancy-list-scroll">
                    {filteredVacancies.length > 0 ? filteredVacancies.map(vacancy => (
                        <div 
                            key={vacancy.id} 
                            className={`vacancy-list-item ${selectedVacancy?.id === vacancy.id ? 'selected' : ''}`}
                            onClick={() => setSelectedVacancy(vacancy)}
                        >
                            <div className="vacancy-item-logo" style={{backgroundColor: vacancy.isPremium ? '#fffbe6' : '#f0f0f0'}}>
                                {vacancy.company.charAt(0)}
                            </div>
                            <div className="vacancy-item-info">
                                <p className="vacancy-item-title">{vacancy.title}</p>
                                <p className="vacancy-item-company">{vacancy.company}</p>
                            </div>
                            <div className="vacancy-item-meta">
                                <div className="meta-top-row">
                                    {vacancy.isPremium && <span className="premium-badge">PREMIUM</span>}
                                    <span className="views">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>
                                        {vacancy.views}
                                    </span>
                                </div>
                                <span className="posted">{vacancy.posted}</span>
                                <span 
                                    className={`favorite ${favorites.includes(vacancy.id) ? 'favorited' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(vacancy.id); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>
                                </span>
                            </div>
                        </div>
                    )) : <p className="no-results">Axtarışa uyğun nəticə tapılmadı.</p>}
                </div>
            </div>

            <div className="vacancy-detail-panel">
                {selectedVacancy ? (
                    <>
                        <div className="detail-header">
                            <h1>
                                {selectedVacancy.title} 
                                {selectedVacancy.verified && <span className="verified-badge" title="Təsdiqlənmiş Vakansiya">✔</span>}
                            </h1>
                            <div className="detail-tags">
                                <span>🕒 Son tarix {new Date(selectedVacancy.deadline).toLocaleDateString('az-AZ')}</span>
                                <span 
                                    className="category-tag clickable"
                                    onClick={() => handleCategoryClick(selectedVacancy.category)}
                                    title={`'${selectedVacancy.category}' üzrə filtrlə`}
                                >
                                    {selectedVacancy.category}
                                </span>
                            </div>
                        </div>

                        <div className="detail-tabs">
                            <button className={`tab-button ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
                                İşin təsviri
                            </button>
                            <button className={`tab-button ${activeTab === 'company' ? 'active' : ''}`} onClick={() => setActiveTab('company')}>
                                Şirkət haqqında
                            </button>
                        </div>

                        <div className="detail-content">{renderDetailContent()}</div>

                        <div className="telegram-banner">
                            <p>Vakansiyalar barədə məlumatı ən tez bizim <a href="https://t.me/" target="_blank" rel="noopener noreferrer">Telegram kanalında</a> izləyə bilərsiniz.</p>
                        </div>

                        <div className="detail-footer">
                            <div className="footer-actions">
                                <span onClick={handlePrint}>📄 Çap et</span>
                                <span onClick={handleReport}>🚩 Şikayət et</span>
            </div>
                            <button 
                                className="apply-button"
                                onClick={() => handleApply(selectedVacancy.id)}
                                disabled={applied.includes(selectedVacancy.id)}
                            >
                                {applied.includes(selectedVacancy.id) ? '✓ Müraciət Olundu' : '▲ Müraciət et'}
                </button>
            </div>
                    </>
                ) : (
                    <div className="no-vacancy-selected">
                        <h2>Vakansiya seçin</h2>
                        <p>Baxmaq üçün soldakı siyahıdan bir vakansiya seçin.</p>
          </div>
                )}
      </div>
    </div>
  );
};

export default Vacancy; 
