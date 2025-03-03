
import React, { useState, useEffect } from 'react';
import { menuItems, MenuItem } from '@/lib/data';
import MenuCard from '@/components/MenuCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, IndianRupee } from 'lucide-react';

const Menu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Get unique categories
  const categories = ['All', ...new Set(menuItems.map(item => item.category))];
  
  // Filter items based on search query and selected category
  useEffect(() => {
    // Debounced search implementation
    const timer = setTimeout(() => {
      const filtered = menuItems.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        
        if (searchQuery.trim() === '') {
          return matchesCategory;
        }
        
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query) ||
          item.price.toString().includes(query);
        
        return matchesCategory && matchesQuery;
      });
      
      setFilteredItems(filtered);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory]);
  
  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-medium mb-3">Our Menu</h1>
        <p className="text-muted-foreground">
          Browse our selection of authentic Indian dishes and add them to your order
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
      
      <Tabs 
        defaultValue="All" 
        value={activeCategory}
        onValueChange={handleCategoryChange}
        className="w-full max-w-5xl mx-auto"
      >
        <TabsList className="mb-8 flex flex-wrap justify-center">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-sm">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-0">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default Menu;
