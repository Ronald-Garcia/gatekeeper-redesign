export type User = {
    id: number;
    name: string;
    cardNum: string;
    lastDigitOfCardNum: number;
    JHED: string;
    isAdmin: number;
    graduationYear: number | null;
}