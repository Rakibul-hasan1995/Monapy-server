import React, { useState, ReactNode } from 'react';

interface TabProps {
  label: string;
  children: ReactNode;
}

interface TabsProps {
  children: ReactNode[];
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>((children[0] as React.ReactElement<TabProps>).props.label);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, newActiveTab: string) => {
    e.preventDefault();
    setActiveTab(newActiveTab);
  };

  return (
    <div className="">
      <div className="flex border-b border-gray-300 dark:border-base-dark">
        {children.map((child) => (
          <button
            key={(child as React.ReactElement<TabProps>).props.label}
            className={`${activeTab === (child as React.ReactElement<TabProps>).props.label
              ? 'border-b-2 border-purple-500 bg-base-lt dark:bg-base-dark'
              : ''
              } flex-1 font-medium py-2`}
            onClick={(e) => handleClick(e, (child as React.ReactElement<TabProps>).props.label)}
          >
            {(child as React.ReactElement<TabProps>).props.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {children.map((child) => {
          if ((child as React.ReactElement<TabProps>).props.label === activeTab) {
            return <div key={(child as React.ReactElement<TabProps>).props.label}>{(child as React.ReactElement<TabProps>).props.children}</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return (
    <div className="hidden" >
      {children}
    </div>
  );
};
