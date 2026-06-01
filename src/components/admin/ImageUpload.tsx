import React, { useState, useRef } from 'react';
import { Upload, X, Star } from 'lucide-react';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  isFeatured: boolean;
}

interface ImageUploadProps {
  onImagesChange: (images: ImageFile[]) => void;
  maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange, maxFiles = 10 }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload JPG, PNG, or WebP images only.');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size should be less than 5MB.');
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList) => {
    const newImages: ImageFile[] = [];

    Array.from(files).forEach((file) => {
      if (validateFile(file) && images.length + newImages.length < (maxFiles || 10)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const image: ImageFile = {
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: e.target?.result as string,
            isFeatured: images.length + newImages.length === 0, // First image is featured
          };

          const updatedImages = [...images, ...newImages, image];
          setImages(updatedImages);
          onImagesChange(updatedImages);
        };
        reader.readAsDataURL(file);
        newImages.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: '',
          isFeatured: false,
        });
      }
    });

    if (images.length + newImages.length >= (maxFiles || 10)) {
      alert(`You can upload a maximum of ${maxFiles || 10} images.`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);

    // If removed image was featured and there are other images, make first one featured
    if (images.find((img) => img.id === id)?.isFeatured && updatedImages.length > 0) {
      updatedImages[0].isFeatured = true;
    }

    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const toggleFeatured = (id: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isFeatured: img.id === id,
    }));
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--primary-color)' : 'var(--border-color)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragging ? 'rgba(11, 34, 57, 0.05)' : 'var(--bg-main)',
          transition: 'all var(--transition-fast)',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={40} style={{ color: 'var(--secondary-color)', marginBottom: '12px' }} />
        <p style={{ margin: '8px 0 4px', fontWeight: 600, color: 'var(--text-main)' }}>
          Drag & drop images here or click to browse
        </p>
        <small style={{ color: 'var(--text-muted)' }}>
          JPG, PNG, WebP • Max 5MB each • Up to {maxFiles || 10} images
        </small>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-main)' }}>
            Uploaded Images ({images.length}/{maxFiles || 10})
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '16px',
          }}>
            {images.map((image, index) => (
              <div
                key={image.id}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0',
                  border: image.isFeatured ? '3px solid var(--secondary-color)' : '1px solid var(--border-color)',
                }}
              >
                {/* Image Preview */}
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                  }}
                />

                {/* Featured Badge */}
                {image.isFeatured && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '4px',
                    background: 'var(--secondary-color)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                  }}>
                    FEATURED
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: 0,
                  transition: 'opacity var(--transition-fast)',
                }}>
                  <button
                    title={image.isFeatured ? 'Already featured' : 'Set as featured'}
                    onClick={() => !image.isFeatured && toggleFeatured(image.id)}
                    style={{
                      background: image.isFeatured ? 'var(--secondary-color)' : 'rgba(255, 255, 255, 0.3)',
                      border: 'none',
                      color: 'white',
                      padding: '6px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <Star size={16} fill="currentColor" />
                  </button>
                  <button
                    title="Remove"
                    onClick={() => removeImage(image.id)}
                    style={{
                      background: '#f44336',
                      border: 'none',
                      color: 'white',
                      padding: '6px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Hover effect for buttons - Fixed CSS-in-JS */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  transition: 'background-color var(--transition-fast)',
                }} onMouseEnter={(e) => {
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    const buttons = parent.querySelector('div:nth-child(3)') as HTMLElement;
                    if (buttons) buttons.style.opacity = '1';
                  }
                }} onMouseLeave={(e) => {
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    const buttons = parent.querySelector('div:nth-child(3)') as HTMLElement;
                    if (buttons) buttons.style.opacity = '0';
                  }
                }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
