import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path) => location?.pathname === path;

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery?.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery?.trim()) {
      setIsSearchExpanded(false);
    }
  };

  const primaryNavItems = [
    { path: '/notes-dashboard', label: 'Notes', icon: 'FileText' },
    { path: '/note-editor', label: 'Editor', icon: 'Edit3' },
    { path: '/calendar-view', label: 'Calendar', icon: 'Calendar' },
    { path: '/search-results', label: 'Search', icon: 'Search' },
  ];

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Calendar" size={20} color="white" />
      </div>
      <span className="text-xl font-semibold text-foreground font-sans">
        CalNote
      </span>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 ml-8">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActive(item?.path) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="hover-lift"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Spacer to push right content to the right */}
        <div className="flex-1"></div>

        {/* Right Side Content - Search Bar and Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search Bar */}
          <div className="max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <div className={`relative transition-all duration-300 ease-out-custom ${
                isSearchExpanded ? 'w-80' : 'w-64'
              }`}>
                <Input
                  type="search"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="pl-10 pr-4 h-9 bg-muted border-border focus:bg-background progressive-disclosure"
                />
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchExpanded(false);
                    }}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-muted-foreground/10"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="state-change"
          >
            <Icon name={showMobileMenu ? 'X' : 'Menu'} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-border bg-background animate-slide-up">
          <div className="p-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pl-10 pr-4 h-9 bg-muted border-border focus:bg-background"
                />
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-muted-foreground/10"
                  >
                    <Icon name="X" size={14} />
                  </Button>
                )}
              </form>
            </div>
            
            <nav className="flex flex-col space-y-2">
              {primaryNavItems?.map((item) => (
                <Button
                  key={item?.path}
                  variant={isActive(item?.path) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    navigate(item?.path);
                    setShowMobileMenu(false);
                  }}
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="justify-start hover-lift"
                  fullWidth
                >
                  {item?.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;