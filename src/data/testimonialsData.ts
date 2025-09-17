
export interface TestimonialData {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export const testimonialsData: TestimonialData[] = [
  {
    id: '1',
    name: 'Ahmed Abdullah',
    role: 'Software Developer',
    content: '{brandInfo.platformName} has completely changed how I approach online learning. Having all my course access in one place is incredibly convenient.',
    rating: 5
  },
  {
    id: '2',
    name: 'Mohamed Ibrahim',
    role: 'Marketing Specialist',
    content: 'The value for money is incredible. I\'m able to access multiple premium learning platforms for a fraction of what I\'d pay individually.',
    rating: 5
  },
  {
    id: '3',
    name: 'Fatima Rahman',
    role: 'Data Scientist',
    content: 'Customer support is excellent, and I love that I can request custom plans based on the specific platforms I need for my learning path.',
    rating: 5
  }
];
