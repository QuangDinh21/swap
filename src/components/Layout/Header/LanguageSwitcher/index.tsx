import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gu-corp/gu-ui';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 flex items-center">
          <span className="">{currentLanguage.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={i18n.language === lang.code ? 'bg-slate-100' : ''}
          >
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
