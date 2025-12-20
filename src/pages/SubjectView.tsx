import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Manifest, Subject } from '../types';

const SubjectView: React.FC = () => {
    const { subjectName } = useParams<{ subjectName: string }>();
    const navigate = useNavigate();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/manifest.json')
            .then(res => res.json())
            .then((data: Manifest) => {
                const found = data.subjects.find(s => s.name === subjectName);
                if (found) {
                    setSubject(found);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load manifest', err);
                setLoading(false);
            });
    }, [subjectName]);

    const handleFileClick = (fileName: string) => {
        // Construct path to file
        const filePath = `/Resources/${subjectName}/${fileName}`;
        window.open(filePath, '_blank');
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    if (!subject) return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Subject Not Found</h2>
            <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--accent-color)', borderRadius: '8px', color: 'white' }}>Go Home</button>
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '30px',
                    fontSize: '1rem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
                ← Back to Subjects
            </button>

            <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{subject.name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>{subject.files.length} Resources Available</p>
            </header>

            <div style={{ display: 'grid', gap: '16px' }}>
                {subject.files.map((file) => (
                    <div
                        key={file}
                        onClick={() => handleFileClick(file)}
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--accent-color)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--card-bg)';
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '1.5rem' }}>📄</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{file}</span>
                        </div>
                        <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>View PDF →</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubjectView;
