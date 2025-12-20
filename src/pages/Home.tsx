import React, { useEffect, useState } from 'react';
import SubjectCard from '../components/SubjectCard';
import type { Manifest, Subject } from '../types';

const Home: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/manifest.json')
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
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '30px'
            }}>
                {subjects.map((subject) => (
                    <SubjectCard
                        key={subject.name}
                        name={subject.name}
                        fileCount={subject.files.length}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
