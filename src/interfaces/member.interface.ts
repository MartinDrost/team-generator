export default interface IMember {
  id?: string;
  name: string;
  imagePath?: string;
  skill: number; // 0 - 100 scale

  // base64 string to add a new image
  imageData?: string;
}
