export type FlyingMachinesQuery = {
  page?: string | string[];
  pageSize?: string | string[];
  sort?: string | string[];
  weapons?: string | string[];
  Attack?: string | string[];
  Defense?: string | string[];
  Speed?: string | string[];
  Agility?: string | string[];
  Capacity?: string | string[];
};

export type StrapiPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export interface Machine {
  id: number;
  documentId: string;
  Name: string;
  Attack: number;
  Defense: number;
  Speed: number;
  Agility: number;
  Capacity: number;
  Image: any;
  weapons: Weapon[];
}

export interface Weapon {
  id: number;
  documentId: string;
  Name: string;
}


export interface CreateContactMessageFormState {
    errors?: {
        Name?: string[];
        Email?: string[];
        Message?: string[];
    };
    message?: string;
    success?: string;
}