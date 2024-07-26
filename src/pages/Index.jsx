import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';

const fetchStories = async (searchTerm = '') => {
  const response = await fetch(`https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=100&query=${searchTerm}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const StoryItem = ({ story }) => (
  <div className="border-b border-gray-200 py-4">
    <h2 className="text-lg font-semibold">{story.title}</h2>
    <p className="text-sm text-gray-600">Upvotes: {story.points}</p>
    <a
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      Read More
    </a>
  </div>
);

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
  </div>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error, refetch } = useQuery(['stories', searchTerm], () => fetchStories(searchTerm));

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Top 100 Hacker News Stories</h1>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </form>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error.message}</p>
      ) : (
        <div className="space-y-4">
          {data?.hits.map((story) => (
            <StoryItem key={story.objectID} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
