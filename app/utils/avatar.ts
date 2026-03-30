// Utilitats per a la gestió d'avatars de perfil

// Funció per generar la URL del avatar a partir del nombre
// Es genera dinàmicament sense necessitat de guardar-la
export const getAvatarUrl = (name: string | null): string => {
  if (name === null)
    return 'https://ui-avatars.com/api/?name=User&background=random&color=fff';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
};
