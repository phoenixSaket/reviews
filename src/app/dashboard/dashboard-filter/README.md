# Dashboard Filter Component

A comprehensive filter component for the dashboard that allows users to filter charts by app, platform, and chart type.

## Features

- **App Filtering**: Filter charts by specific app names
- **Platform Filtering**: Filter by iOS or Android platforms
- **Chart Type Filtering**: Filter by chart types (Ratings Distribution, Average Ratings Graph, Distributed Ratings Graph)
- **Real-time Filtering**: Filters are applied immediately as selections change
- **Clear All Filters**: One-click option to reset all filters
- **Active Filter Tags**: Visual representation of currently active filters
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Results Handling**: Shows helpful message when no charts match the filters

## Usage

### Basic Integration

```html
<app-dashboard-filter 
  [charts]="charts" 
  (filterChange)="onFilterChange($event)">
</app-dashboard-filter>
```

### Component Inputs

- `charts: any[]` - Array of chart objects to filter

### Component Outputs

- `filterChange: EventEmitter<FilterOptions>` - Emits filter changes with the following interface:

```typescript
interface FilterOptions {
  type: string;    // 'All', 'Ratings Distribution', 'Average Ratings Graph', 'Distributed Ratings Graph'
  app: string;     // 'All' or specific app name
  platform: string; // 'All', 'iOS', 'Android'
}
```

## Implementation in Dashboard

The filter component is integrated into the dashboard component with the following features:

1. **Filter State Management**: Maintains current filter state
2. **Filtered Charts**: Separate arrays for filtered main charts, ratings charts, and line charts
3. **Dynamic App List**: Automatically populates app dropdown based on available charts
4. **Real-time Updates**: Charts update immediately when filters change

## Styling

The component uses CSS custom properties for theming and includes:

- Modern card-based design
- Hover effects and transitions
- Responsive grid layout
- Dark mode support
- Material Design icons
- Accessible focus states

## Dependencies

- Angular Reactive Forms
- Material Design Icons
- CSS Grid and Flexbox for layout

## Browser Support

- Modern browsers with CSS Grid support
- Responsive design for mobile devices
- Progressive enhancement for older browsers 