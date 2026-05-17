import React, { useEffect, useState } from 'react';
import SubjectCard from '../components/SubjectCard';
import type { Manifest, Subject } from '../types';

// Helper: extract semester tag (S1, S2, S3, S4) from folder name
const getSemTag = (name: string): string | null => {
    const match = name.match(/_S(\d+)$/i);
    return match ? `S${match[1]}` : null;
};

// Helper: strip _S? suffix for display
const getDisplayName = (name: string): string => {
    return name.replace(/_S\d+$/i, '');
};

// Semester → Year mapping
const semToYear: Record<string, number> = {
    S1: 1, S2: 1,
    S3: 2, S4: 2,
};

const semLabel: Record<string, string> = {
    S1: 'Semester 1', S2: 'Semester 2',
    S3: 'Semester 3', S4: 'Semester 4',
};

interface Grouped {
    [year: number]: {
        [sem: string]: Subject[];
    };
}

const Home: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/subjects.json')
            .then(res => res.json())
            .then((data: Manifest) => {
                setSubjects(data.subjects);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load manifest', err);
                setLoading(false);
            });
    }, []);

    // Group subjects by year → semester
    const grouped: Grouped = {};
    const ungrouped: Subject[] = [];

    subjects.forEach(subject => {
        const semTag = getSemTag(subject.name);
        if (semTag && semToYear[semTag] !== undefined) {
            const year = semToYear[semTag];
            if (!grouped[year]) grouped[year] = {};
            if (!grouped[year][semTag]) grouped[year][semTag] = [];
            grouped[year][semTag].push(subject);
        } else {
            ungrouped.push(subject);
        }
    });

    const sortedYears = Object.keys(grouped).map(Number).sort();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
                <div className="loader" style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }}>Loading Resources...</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <style>
                    {`
                    .ai-link {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 20px;
                        background: rgba(139, 92, 246, 0.1);
                        border: 1px solid rgba(139, 92, 246, 0.3);
                        color: #a78bfa;
                        text-decoration: none;
                        border-radius: 999px;
                        font-weight: 600;
                        font-size: 0.95rem;
                        margin-bottom: 24px;
                        transition: all 0.3s ease;
                        box-shadow: 0 0 15px rgba(139, 92, 246, 0.1);
                    }
                    .ai-link:hover {
                        background: rgba(139, 92, 246, 0.2);
                        border-color: rgba(139, 92, 246, 0.5);
                        transform: translateY(-2px);
                        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
                        color: #ddd6fe;
                    }
                    `}
                </style>
                <a href="https://studyassistant.mslab.cc" target="_blank" rel="noopener noreferrer" className="ai-link">
                    ✨ Try New AI Study Assistant <span>→</span>
                </a>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #38bdf8, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>
                    Study Portal
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Access all your learning resources in one place
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                    !! Verify before using — based on notes still may contain errors. !!
                </p>
            </header>

            {/* Year → Semester → Subjects */}
            {sortedYears.map(year => (
                <section key={year} style={{ marginBottom: '60px' }}>
                    {/* Year Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '32px',
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
                            borderRadius: '12px',
                            padding: '8px 20px',
                            fontWeight: '800',
                            fontSize: '1.4rem',
                            color: '#fff',
                            letterSpacing: '0.5px',
                            boxShadow: '0 4px 15px rgba(56,189,248,0.3)',
                        }}>
                            Year {year}
                        </div>
                        <div style={{
                            flex: 1,
                            height: '2px',
                            background: 'linear-gradient(to right, rgba(56,189,248,0.4), transparent)',
                            borderRadius: '2px',
                        }} />
                    </div>

                    {/* Semesters within this year */}
                    {Object.keys(grouped[year]).sort().map(semTag => (
                        <div key={semTag} style={{ marginBottom: '40px' }}>
                            {/* Semester Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: '20px',
                                paddingLeft: '8px',
                            }}>
                                <span style={{
                                    width: '4px',
                                    height: '28px',
                                    background: 'var(--accent-color)',
                                    borderRadius: '4px',
                                    display: 'inline-block',
                                }} />
                                <h2 style={{
                                    fontSize: '1.2rem',
                                    fontWeight: '600',
                                    color: 'var(--text-secondary)',
                                    margin: 0,
                                    letterSpacing: '0.3px',
                                }}>
                                    {semLabel[semTag] ?? semTag}
                                </h2>
                            </div>

                            {/* Subject Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                gap: '24px',
                                paddingLeft: '16px',
                            }}>
                                {grouped[year][semTag].map(subject => (
                                    <SubjectCard
                                        key={subject.name}
                                        name={subject.name}
                                        displayName={getDisplayName(subject.name)}
                                        fileCount={subject.files.length}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            ))}

            {/* Ungrouped subjects (no _S? suffix) */}
            {ungrouped.length > 0 && (
                <section style={{ marginBottom: '60px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '24px',
                    }}>
                        <div style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '8px 20px',
                            fontWeight: '700',
                            fontSize: '1.2rem',
                            color: 'var(--text-secondary)',
                        }}>
                            Other Resources
                        </div>
                        <div style={{
                            flex: 1,
                            height: '2px',
                            background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)',
                            borderRadius: '2px',
                        }} />
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '24px',
                    }}>
                        {ungrouped.map(subject => (
                            <SubjectCard
                                key={subject.name}
                                name={subject.name}
                                displayName={subject.name}
                                fileCount={subject.files.length}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Developer Info Section */}
            <style>
                {`
                .social-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--text-secondary);
                    text-decoration: none;
                    padding: 12px 28px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    font-weight: 500;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    backdrop-filter: blur(10px);
                }
                .social-btn svg {
                    width: 22px;
                    height: 22px;
                    fill: currentColor;
                    transition: transform 0.3s ease;
                }
                .social-btn.github:hover {
                    color: #fff;
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.4);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1);
                }
                .social-btn.linkedin:hover {
                    color: #fff;
                    background: rgba(10, 102, 194, 0.2);
                    border-color: #0a66c2;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(10, 102, 194, 0.25);
                }
                .social-btn:hover svg {
                    transform: scale(1.1);
                }
                .portfolio-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 32px;
                    background: linear-gradient(135deg, #38bdf8, #8b5cf6);
                    color: #fff;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    box-shadow: 0 4px 15px rgba(56,189,248,0.3);
                    transition: all 0.3s ease;
                }
                .portfolio-btn:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 6px 20px rgba(56,189,248,0.4);
                }
                .portfolio-btn:hover .arrow {
                    transform: translateX(4px);
                }
                .arrow {
                    transition: transform 0.3s ease;
                }
                `}
            </style>
            <footer style={{
                marginTop: '100px',
                paddingTop: '60px',
                paddingBottom: '20px',
                borderTop: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '32px',
                textAlign: 'center'
            }}>
                <div>
                    <h3 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        margin: '0 0 12px 0',
                        background: 'linear-gradient(to right, #e2e8f0, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Developed by Meet Sanwadkar
                    </h3>
                    <p style={{
                        color: 'var(--text-secondary)',
                        margin: 0,
                        fontSize: '1.1rem',
                        maxWidth: '500px',
                        lineHeight: '1.6'
                    }}>
                        Need a custom website, portfolio, or full-stack project? Feel free to contact me for freelance work and collaborations!
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginBottom: '8px'
                }}>
                    <a href="https://github.com/meet112114" target="_blank" rel="noopener noreferrer" className="social-btn github">
                        <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        GitHub
                    </a>
                    <a href="https://linkedin.com/in/meet-sanwadkar" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                        <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        LinkedIn
                    </a>
                </div>

                <a href="https://portfolio.mslab.cc" target="_blank" rel="noopener noreferrer" className="portfolio-btn">
                    Visit My Portfolio
                    <span style={{ fontSize: '1.2rem' }} className="arrow">→</span>
                </a>
            </footer>
        </div>
    );
};

export default Home;
