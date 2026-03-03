import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SubjectCardProps {
  name: string;        // raw folder name (used for routing), e.g. "DBMS_S1"
  displayName: string; // clean display name, e.g. "DBMS"
  fileCount: number;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ name, displayName, fileCount }) => {
  const navigate = useNavigate();

  return (
    <div
      className="subject-card"
      onClick={() => navigate(`/subject/${encodeURIComponent(name)}`)}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '180px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.borderColor = 'var(--accent-color)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.6rem',
        marginBottom: '16px',
        color: '#fff',
        fontWeight: '700',
        boxShadow: '0 10px 15px -3px rgba(56, 189, 248, 0.3)'
      }}>
        {displayName.charAt(0).toUpperCase()}
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '8px', textAlign: 'center' }}>{displayName}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{fileCount} Files</p>
    </div>
  );
};

export default SubjectCard;
