import { useMemo, useState } from 'react';

import styles from './LoginPage.module.scss';

type UniversityOption = {
  id: string;
  title: string;
  subtitle: string;
};

const UNIVERSITY_OPTIONS: UniversityOption[] = [
  { id: 'max', title: 'Макс Университет', subtitle: 'Личный кабинет MAX' },
  { id: 'csu', title: 'Челябинский государственный университет', subtitle: 'Личный кабинет ЧГУ' },
  { id: 'other', title: 'Другой ВУЗ', subtitle: 'Использовать общий вход' },
];

type LoginPageProps = {
  onLogin: (payload: { universityId: string; email: string; password: string }) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOption = useMemo(
    () => UNIVERSITY_OPTIONS.find((option) => option.id === selectedUniversity) ?? null,
    [selectedUniversity],
  );

  const isFormReady = Boolean(selectedUniversity && email.trim() && password.trim());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedUniversity || !isFormReady) {
      return;
    }

    setIsSubmitting(true);
    try {
      onLogin({
        universityId: selectedUniversity,
        email: email.trim(),
        password,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Личный кабинет</h1>
          <p className={styles.subtitle}>для студентов</p>
        </div>

        <div className={styles.universityList}>
          {UNIVERSITY_OPTIONS.map((option) => {
            const isActive = option.id === selectedUniversity;
            return (
              <button
                key={option.id}
                type="button"
                className={
                  isActive
                    ? `${styles.universityButton} ${styles.universityButtonActive}`
                    : styles.universityButton
                }
                onClick={() => setSelectedUniversity(option.id)}
              >
                <div className={styles.universityTitle}>{option.title}</div>
                <div className={styles.universitySubtitle}>{option.subtitle}</div>
              </button>
            );
          })}
        </div>

        {selectedOption ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="login-email">
                E-mail
              </label>
              <input
                id="login-email"
                className={styles.input}
                type="email"
                placeholder="student@example.ru"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="login-password">
                Пароль
              </label>
              <input
                id="login-password"
                className={styles.input}
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <p className={styles.hint}>
              Вход выполняется через {selectedOption.title}. Используйте корпоративную почту и пароль.
            </p>

            <button className={styles.submit} type="submit" disabled={!isFormReady || isSubmitting}>
              Войти в аккаунт
            </button>
          </form>
        ) : (
          <p className={styles.footerText}>Выберите университет, чтобы продолжить авторизацию</p>
        )}
      </div>
    </div>
  );
}


