import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Subject } from '../types';

const SubjectView: React.FC = () => {
    const { subjectName } = useParams<{ subjectName: string }>();
    const navigate = useNavigate();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPath, setCurrentPath] = useState<string[]>([]);

    useEffect(() => {
        // Optimistically set subject name from URL while loading
        if (subjectName) {
            // We can't know files yet, but we can set the name
        }

        fetch(`/data/${subjectName}.json`)
            .then(res => {
                if (!res.ok) throw new Error('Subject not found');
                return res.json();
            })
            .then((data: Subject) => {
                setSubject(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load subject data', err);
                setLoading(false);
            });
    }, [subjectName]);

    // Calculate items to display based on current path
    const viewItems = useMemo(() => {
        if (!subject) return { folders: [], files: [] };

        const currentPathStr = currentPath.join('/');
        const folders = new Set<string>();
        const files: string[] = [];

        subject.files.forEach(file => {
            // Check if file belongs to current path
            if (currentPath.length > 0 && !file.startsWith(currentPathStr + '/')) {
                return;
            }

            // Get relative path part
            const relativePath = currentPath.length > 0
                ? file.slice(currentPathStr.length + 1)
                : file;

            const parts = relativePath.split('/');

            if (parts.length > 1) {
                // It's in a subfolder relative to current view
                folders.add(parts[0]);
            } else {
                // It's a file in current view
                files.push(file); // Store full path for opening
            }
        });

        return {
            folders: Array.from(folders).sort(),
            files: files.sort()
        };
    }, [subject, currentPath]);

    const handleFolderClick = (folderName: string) => {
        setCurrentPath([...currentPath, folderName]);
    };

    const handleFileClick = (fullPath: string) => {
        const filePath = `/Resources/${subjectName}/${fullPath}`;
        window.open(filePath, '_blank');
    };

    const handleBackClick = () => {
        if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
        } else {
            navigate('/');
        }
    };

    const getDisplayName = (fullPath: string) => {
        return (fullPath.split('/').pop() || fullPath).replace(/\.pdf$/i, '');
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
                onClick={handleBackClick}
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
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
                ← {currentPath.length > 0 ? 'Back' : 'Back to Subjects'}
            </button>

            <header style={{ marginBottom: '40px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{subject.name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    {currentPath.length > 0 ? `/${currentPath.join('/')}` : 'All Resources'}
                </p>
            </header>

            <div style={{ display: 'grid', gap: '16px' }}>
                {/* Folders */}
                {viewItems.folders.map((folder) => (
                    <div
                        key={folder}
                        onClick={() => handleFolderClick(folder)}
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
                            <span style={{ fontSize: '1.5rem' }}>📁</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{folder}</span>
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Open Folder →</span>
                    </div>
                ))}

                {/* Files */}
                {viewItems.files.map((file) => (
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
                            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{getDisplayName(file)}</span>
                        </div>
                        <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>View PDF →</span>
                    </div>
                ))}

                {viewItems.folders.length === 0 && viewItems.files.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        No files in this folder.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectView;
