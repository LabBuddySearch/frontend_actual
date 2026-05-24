import { Camera, Trash2, User } from 'lucide-react';
import { useRef, useState } from 'react';
import styles from '@/pages/Profile.module.css';

type Props = {
  fullName?: string;
};

/**
 * UI аватара. API загрузки (multipart) на бэкенде пока нет — действия показывают заглушку.
 */
export function ProfileAvatar({ fullName }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stubMessage, setStubMessage] = useState<string | null>(null);

  const showStub = (message: string) => {
    setStubMessage(message);
    window.setTimeout(() => setStubMessage(null), 4000);
  };

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showStub('Выберите файл изображения (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showStub('Размер файла не должен превышать 5 МБ.');
      return;
    }
    const url = URL.createObjectURL(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(url);
    showStub(
      'Фото выбрано локально. Загрузка на сервер будет доступна после подключения API (POST /api/profile/avatar).',
    );
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (inputRef.current) inputRef.current.value = '';
    showStub('Удаление аватара на сервере будет доступно после подключения API (DELETE /api/profile/avatar).');
  };

  const initials = (fullName ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className={styles.avatarBlock}>
      <div
        className={styles.avatarLg}
        style={
          previewUrl
            ? {
                backgroundImage: `url(${previewUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {!previewUrl && (
          <span className={styles.avatarInitials} aria-hidden>
            {initials || <User className="size-10 text-white/80" />}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        type="file"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />

      <div className={styles.avatarActions}>
        <button className={styles.avatarBtn} type="button" onClick={handlePickFile}>
          <Camera size={16} />
          Изменить фото
        </button>
        <button
          className={`${styles.avatarBtn} ${styles.avatarBtnDanger}`}
          type="button"
          onClick={handleRemove}
          disabled={!previewUrl}
        >
          <Trash2 size={16} />
          Удалить
        </button>
      </div>

      {stubMessage && (
        <p className={styles.avatarStubNote} role="status">
          {stubMessage}
        </p>
      )}
    </div>
  );
}
