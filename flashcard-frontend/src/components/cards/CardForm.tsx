import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardCreateRequest, CardUpdateRequest } from '../../types/card';
import ErrorMessage from '../common/ErrorMessage';

interface CardFormProps {
  deckId: string;
  initialValues?: Card;
  onSubmit: (data: CardCreateRequest | CardUpdateRequest) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  mode: 'create' | 'edit';
}

const CardForm: React.FC<CardFormProps> = ({
  deckId,
  initialValues,
  onSubmit,
  isLoading,
  error,
  mode
}) => {
  const navigate = useNavigate();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (initialValues && mode === 'edit') {
      setFront(initialValues.front);
      setBack(initialValues.back);
      setNotes(initialValues.notes || '');
    }
  }, [initialValues, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({ front, back, notes });
      
      // Navigate based on the action
      if (mode === 'create') {
        // Clear form for another card if in create mode
        setFront('');
        setBack('');
        setNotes('');
        // We stay on the same page to allow creating multiple cards
      } else {
        // Go back to deck detail page after edit
        navigate(`/decks/${deckId}`);
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
    boxSizing: 'border-box',
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

  const cardPreviewStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  };

  const cardFaceStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: 'white',
    minHeight: '50px',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '1.5rem' }}>
        {mode === 'create' ? 'Create New Card' : 'Edit Card'}
      </h2>
      
      {error && <ErrorMessage message={error} />}
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="front">Front (Question)</label>
        <textarea
          id="front"
          style={textareaStyle}
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder="Enter the question or front side of your flashcard"
          required
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="back">Back (Answer)</label>
        <textarea
          id="back"
          style={textareaStyle}
          value={back}
          onChange={(e) => setBack(e.target.value)}
          placeholder="Enter the answer or back side of your flashcard"
          required
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="notes">Notes (Optional)</label>
        <textarea
          id="notes"
          style={{...textareaStyle, minHeight: '80px'}}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes or context (optional)"
        />
      </div>

      {/* Preview of the card */}
      {(front || back) && (
        <div style={cardPreviewStyle}>
          <h3 style={{ margin: '0 0 10px 0' }}>Card Preview</h3>
          <div style={cardFaceStyle}>
            <h4 style={{ margin: '0 0 5px 0', color: '#3498db' }}>Front:</h4>
            <div>{front || <em style={{ color: '#999' }}>Question will appear here</em>}</div>
          </div>
          <div style={cardFaceStyle}>
            <h4 style={{ margin: '0 0 5px 0', color: '#27ae60' }}>Back:</h4>
            <div>{back || <em style={{ color: '#999' }}>Answer will appear here</em>}</div>
          </div>
        </div>
      )}
      
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <button 
          type="submit" 
          style={isLoading ? disabledButtonStyle : buttonStyle}
          disabled={isLoading}
        >
          {isLoading 
            ? (mode === 'create' ? 'Creating...' : 'Saving...') 
            : (mode === 'create' ? 'Create Card' : 'Save Changes')
          }
        </button>
        
        <button 
          type="button" 
          style={cancelButtonStyle}
          onClick={() => navigate(`/decks/${deckId}`)}
        >
          Cancel
        </button>

        {/* Additional button for create mode to clear form */}
        {mode === 'create' && (
          <button 
            type="button" 
            style={{
              ...buttonStyle,
              backgroundColor: '#7f8c8d',
            }}
            onClick={() => {
              setFront('');
              setBack('');
              setNotes('');
            }}
          >
            Clear Form
          </button>
        )}
      </div>
    </form>
  );
};

export default CardForm;