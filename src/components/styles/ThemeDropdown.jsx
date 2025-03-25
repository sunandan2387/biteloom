'use client';


import { useTheme } from 'next-themes';

export const ThemeDropDownMenu = () => {
  const { setTheme } = useTheme();

  return (
    <div className="mr-4">
      <div>
      
        <div align="end">
          <div onClick={() => setTheme('light')}>Light</div>
          <div onClick={() => setTheme('dark')}>Dark</div>
          <div onClick={() => setTheme('system')}>System</div>
        </div>
      </div>
    </div>
  );
};
