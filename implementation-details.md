# Implementation Details

## How to Add Search and Filtering

### 1. Add Search State to Redux Store

Update `src/store/todoSlice.ts`:
```typescript
interface TodosState {
  todos: Todo[];
  searchQuery: string;
  filterStatus: 'all' | 'active' | 'completed';
}

// Add actions
setSearchQuery: (state, action) => {
  state.searchQuery = action.payload;
},
setFilterStatus: (state, action) => {
  state.filterStatus = action.payload;
}
```

### 2. Create Filtered Selector

Add to `src/store/todoSlice.ts`:
```typescript
export const selectFilteredTodos = createSelector(
  [state => state.todos.todos, state => state.todos.searchQuery, state => state.todos.filterStatus],
  (todos, searchQuery, filterStatus) => {
    return todos
      .filter(todo => {
        // Filter by search query
        if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // Filter by status
        if (filterStatus === 'active' && todo.completed) return false;
        if (filterStatus === 'completed' && !todo.completed) return false;
        return true;
      });
  }
);
```

### 3. Create Search Component

Create `src/components/SearchBar.tsx`:
```typescript
export const SearchBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(state => state.todos.searchQuery);
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search todos..."
        value={searchQuery}
        onChangeText={(text) => dispatch(setSearchQuery(text))}
        testID="search-input"
      />
      <TouchableOpacity onPress={() => dispatch(setSearchQuery(''))}>
        <MaterialIcons name="clear" size={20} />
      </TouchableOpacity>
    </View>
  );
};
```

### 4. Create Filter Component

Create `src/components/FilterTabs.tsx`:
```typescript
export const FilterTabs: React.FC = () => {
  const dispatch = useAppDispatch();
  const filterStatus = useAppSelector(state => state.todos.filterStatus);
  
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];
  
  return (
    <View style={styles.container}>
      {filters.map(filter => (
        <TouchableOpacity
          key={filter.key}
          style={[styles.tab, filterStatus === filter.key && styles.activeTab]}
          onPress={() => dispatch(setFilterStatus(filter.key))}
          testID={`filter-${filter.key}`}
        >
          <Text style={styles.tabText}>{filter.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

### 5. Update TodoListScreen

Modify `src/screens/TodoListScreen.tsx`:
```typescript
// Import new components
import { SearchBar } from '../components/SearchBar';
import { FilterTabs } from '../components/FilterTabs';
import { selectFilteredTodos } from '../store/todoSlice';

// Use filtered todos instead of all todos
const todos = useAppSelector(selectFilteredTodos);

// Add components to render
return (
  <SafeAreaView>
    <TodoHeader />
    <SearchBar />
    <FilterTabs />
    <FlatList
      data={todos}
      // ... rest of FlatList props
    />
    // ... rest of component
  </SafeAreaView>
);
```

### 6. Persist Search/Filter State (Optional)

Add to middleware if you want to persist search/filter preferences:
```typescript
// In store middleware
const persistedKeys = ['todos', 'searchQuery', 'filterStatus'];
```

### 7. Add Tests

Create `__tests__/SearchFilter.test.ts`:
```typescript
describe('Search and Filter', () => {
  test('filters todos by search query', () => {
    const filtered = selectFilteredTodos({
      todos: { 
        todos: [
          { id: '1', text: 'Buy groceries', completed: false },
          { id: '2', text: 'Walk dog', completed: false }
        ],
        searchQuery: 'groceries',
        filterStatus: 'all'
      }
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].text).toBe('Buy groceries');
  });
  
  test('filters by completion status', () => {
    const filtered = selectFilteredTodos({
      todos: { 
        todos: [
          { id: '1', text: 'Task 1', completed: false },
          { id: '2', text: 'Task 2', completed: true }
        ],
        searchQuery: '',
        filterStatus: 'active'
      }
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].completed).toBe(false);
  });
});
```

### 8. Styling Considerations

- Add visual feedback for active filter
- Consider using debounce for search input to improve performance
- Add clear search button when search is active
- Show result count when filtering

### Implementation Tips

1. **Performance**: Use `useMemo` or `createSelector` for filtering large todo lists
2. **UX**: Show "No results found" message when filters return empty
3. **Accessibility**: Add proper labels and hints for screen readers
4. **Keyboard**: Handle keyboard dismiss when selecting filters
5. **Animation**: Add smooth transitions when filter results change