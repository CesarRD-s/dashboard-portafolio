import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProfileView } from '../app/dashboard/profile/ui/profile.view';
import { Avatar } from '../app/components/layout/header/Avatar';

describe('cuenta sin perfil', () => {
    it('muestra la opción de crear un perfil sin intentar cargar un avatar', () => {
        const profilePage = renderToStaticMarkup(<ProfileView profile={null} />);
        const avatar = renderToStaticMarkup(<Avatar profile={null} />);

        expect(profilePage).toContain('Todavía no has completado tu perfil');
        expect(profilePage).toContain('Crear perfil');
        expect(profilePage).toContain('/dashboard/profile/edit');
        expect(avatar).toContain('Sin avatar');
        expect(avatar).not.toContain('<img');
    });
});
