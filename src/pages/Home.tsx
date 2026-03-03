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
                    !! VERIFY DS ALGORITHM'S IN QB_ANS PDF !!
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
        </div>
    );
};

export default Home;
