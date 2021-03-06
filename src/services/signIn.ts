interface ReceivedData {
  idUser: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  avatar_url: string;
  email: string;
}

interface ResponseData {
  data: {
    user: User;
    token: string;
  }
}

export default function signIn({ idUser, password }: ReceivedData): Promise<ResponseData> {
  if (idUser === 'admin' && password === 'admin')
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: {
              id: 'id_user',
              name: 'name_user',
              avatar_url: 'avatar_user',
              email: 'mail_user',
            },
            token: 'psm2jb4_ias¨@'
          }
        });
      }, 1000);
    });
  throw new Error();
}
