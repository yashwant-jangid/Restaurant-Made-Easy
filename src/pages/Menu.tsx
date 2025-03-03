
import React, { useState } from 'react';
import { menuItems, MenuItem } from '@/lib/data';
import MenuCard from '@/components/MenuCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  // Filter items based on search query and selected category
  const filterItems = (items: MenuItem[], category: string, query: string) => {
    return items.filter(item => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesQuery = 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      return matchesCategory && matchesQuery;
    });
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-medium mb-3">Our Menu</h1>
        <p className="text-muted-foreground">
          Browse our selection of dishes and add them to your order
        </p>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for dishes, ingredients, or categories..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="All" className="w-full max-w-5xl mx-auto">
        <TabsList className="mb-8 flex flex-wrap justify-center">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-sm">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            {filterItems(menuItems, category, searchQuery).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No items found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterItems(menuItems, category, searchQuery).map(item => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Menu;
