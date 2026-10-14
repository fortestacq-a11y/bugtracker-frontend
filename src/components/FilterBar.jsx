import React from 'react';
import {
  LayoutGrid,
  List as ListIcon,
  BarChart3,
  Filter,
  X
} from 'lucide-react';

export function FilterBar({
  viewMode,
  onViewModeChange,
  filters,
  onFilterChange,
  onClearFilters,
  members = [],
  totalCount = 0,
  filteredCount = 0,
}) {
  const hasActiveFilters = Boolean(
    filters.status || filters.priority || filters.type || filters.assigneeId
  );

  return (
    <div className="bg-[#faf9f5]/90 border-b border-[#e8e6dc] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: View Tabs (Board / List / Stats) */}
      <div className="flex items-center gap-1 bg-[#f5f4ed] p-1 rounded-lg border border-[#e8e6dc]">
        <button
          onClick={() => onViewModeChange('board')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
            viewMode === 'board'
              ? 'bg-[#c96442] text-[#faf9f5] shadow-xs'
              : 'text-[#5e5d59] hover:text-[#141413]'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Board</span>
        </button>

        <button
          onClick={() => onViewModeChange('list')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
            viewMode === 'list'
              ? 'bg-[#c96442] text-[#faf9f5] shadow-xs'
              : 'text-[#5e5d59] hover:text-[#141413]'
          }`}
        >
          <ListIcon className="w-3.5 h-3.5" />
          <span>List</span>
        </button>

        <button
          onClick={() => onViewModeChange('stats')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all ${
            viewMode === 'stats'
              ? 'bg-[#c96442] text-[#faf9f5] shadow-xs'
              : 'text-[#5e5d59] hover:text-[#141413]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Metrics</span>
        </button>
      </div>

      {/* Right: Filter dropdowns & issue count */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-[#87867f] text-xs mr-1 hidden sm:flex">
          <Filter className="w-3 h-3" />
          <span>Filters:</span>
        </div>

        {/* Priority Filter */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value || null)}
          className="bg-[#f5f4ed] border border-[#e8e6dc] text-[#3d3d3a] rounded-md px-2.5 py-1 text-xs focus:outline-none focus:border-[#c96442] cursor-pointer"
        >
          <option value="">Priority: All</option>
          <option value="P0">P0 Urgent</option>
          <option value="P1">P1 High</option>
          <option value="P2">P2 Medium</option>
          <option value="P3">P3 Low</option>
        </select>

        {/* Type Filter */}
        <select
          value={filters.type || ''}
          onChange={(e) => onFilterChange('type', e.target.value || null)}
          className="bg-[#f5f4ed] border border-[#e8e6dc] text-[#3d3d3a] rounded-md px-2.5 py-1 text-xs focus:outline-none focus:border-[#c96442] cursor-pointer"
        >
          <option value="">Type: All</option>
          <option value="BUG">Bug</option>
          <option value="FEATURE">Feature</option>
          <option value="REFACTOR">Refactor</option>
          <option value="TASK">Task</option>
          <option value="TECH_DEBT">Tech Debt</option>
        </select>

        {/* Status Filter (applicable in list view) */}
        {viewMode === 'list' && (
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value || null)}
            className="bg-[#f5f4ed] border border-[#e8e6dc] text-[#3d3d3a] rounded-md px-2.5 py-1 text-xs focus:outline-none focus:border-[#c96442] cursor-pointer"
          >
            <option value="">Status: All</option>
            <option value="BACKLOG">Backlog</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
            <option value="CLOSED">Closed</option>
          </select>
        )}

        {/* Assignee Filter */}
        {members.length > 0 && (
          <select
            value={filters.assigneeId || ''}
            onChange={(e) => onFilterChange('assigneeId', e.target.value || null)}
            className="bg-[#f5f4ed] border border-[#e8e6dc] text-[#3d3d3a] rounded-md px-2.5 py-1 text-xs focus:outline-none focus:border-[#c96442] cursor-pointer"
          >
            <option value="">Assignee: All</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#e8e6dc] hover:bg-[#dedbce] text-[#b53333] text-xs font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}

        {/* Issue Counter */}
        <div className="h-4 w-px bg-[#e8e6dc] mx-1 hidden sm:block" />
        <span className="text-[#87867f] font-mono text-xs">
          {filteredCount} {filteredCount === 1 ? 'issue' : 'issues'}
        </span>
      </div>
    </div>
  );
}
