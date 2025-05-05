import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Deck, DeckCreateRequest, DeckUpdateRequest } from '../../types/deck';
import ErrorMessage from '../common/ErrorMessage';

interface DeckFormProps {
  initialValues?: Deck;
  onSubmit: (data: DeckCreateRequest | DeckUpdateRequest) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  mode: 'create' | 'edit';
}

const DeckForm: React.FC<DeckFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  error,
  mode
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialValues && mode === 'edit') {
      setName(initialValues.name);
      setDescription(initialValues.description);
    }
  }, [initialValues, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await onSubmit({ name, description });
      if (result) {
        if (mode === 'create') {
          navigate(`/decks/${result.id}`);
        } else {
          navigate(`/decks/${initialValues?.id}`);
        }
      }
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const formStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginRight: '10px',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: '12px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '1.5rem' }}>
        {mode === 'create' ? 'Create New Deck' : 'Edit Deck'}
      </h2>
      
      {error && <ErrorMessage message={error} />}
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="name">Deck Name</label>
        <input
          id="name"
          type="text"
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for your deck"
          required
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          style={textareaStyle}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a description for your deck"
        />
      </div>
      
      <div style={{ display: 'flex' }}>
        <button 
          type="submit" 
          style={isLoading ? disabledButtonStyle : buttonStyle}
          disabled={isLoading}
        >
          {isLoading 
            ? (mode === 'create' ? 'Creating...' : 'Saving...') 
            : (mode === 'create' ? 'Create Deck' : 'Save Changes')
          }
        </button>
        
        <button 
          type="button" 
          style={cancelButtonStyle}
          onClick={() => navigate(mode === 'create' ? '/decks' : `/decks/${initialValues?.id}`)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DeckForm;