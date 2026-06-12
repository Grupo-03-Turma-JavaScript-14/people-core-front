export const USER_AVATAR_STORAGE_KEY = "peoplecore:userAvatar";
export const USER_AVATAR_UPDATED_EVENT = "peoplecore:userAvatarUpdated";

export function obterAvatarLocal() {
  return localStorage.getItem(USER_AVATAR_STORAGE_KEY) ?? "";
}

export function salvarAvatarLocal(avatar: string) {
  localStorage.setItem(USER_AVATAR_STORAGE_KEY, avatar);
  window.dispatchEvent(
    new CustomEvent(USER_AVATAR_UPDATED_EVENT, { detail: avatar }),
  );
}
