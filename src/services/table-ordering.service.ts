// Table Ordering Types
export interface Table {
  _id: string;
  name: string;
  serviceCharge: number;
  minSpend: number;
  isEnabled: boolean;
  qrCode?: string;
  capacity: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface TableGroup {
  _id: string;
  branchId: string;
  name: string;
  displayOrder: number;
  buttonLabel: string;
  isEnabled: boolean;
  tables: Table[];
  defaultServiceCharge: number;
  defaultMinSpend: number;
  description: string;
  totalTables: number;
  enabledTables: number;
  totalCapacity: number;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TableGroupResponse {
  success: boolean;
  data: TableGroup[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalGroups: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  branchId: string;
}

export interface AvailableTablesResponse {
  success: boolean;
  data: {
    groupId: string;
    groupName: string;
    buttonLabel: string;
    tables: Table[];
  }[];
  branchId: string;
}

export interface TableByQRResponse {
  success: boolean;
  data: {
    group: TableGroup;
    table: Table;
  };
}

export interface TableOrderingStats {
  success: boolean;
  data: {
    totalGroups: number;
    activeGroups: number;
    totalTables: number;
    enabledTables: number;
    totalCapacity: number;
    averageServiceCharge: number;
    groupBreakdown: {
      _id: string;
      name: string;
      isEnabled: boolean;
      totalTables: number;
      enabledTables: number;
      totalCapacity: number;
    }[];
  };
  branchId: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class TableOrderingService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Table Groups CRUD
  async getTableGroups(page = 1, limit = 20, isEnabled?: boolean, includeDisabled = false): Promise<TableGroupResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        includeDisabled: includeDisabled.toString(),
        ...(isEnabled !== undefined && { isEnabled: isEnabled.toString() }),
      });

      const response = await fetch(`${API_BASE_URL}/settings/table-ordering?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching table groups:', error);
      throw error;
    }
  }

  async getTableGroup(id: string): Promise<{ success: boolean; data: TableGroup }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching table group:', error);
      throw error;
    }
  }

  async createTableGroup(groupData: Partial<TableGroup>): Promise<{ success: boolean; data: TableGroup }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating table group:', error);
      throw error;
    }
  }

  async updateTableGroup(id: string, groupData: Partial<TableGroup>): Promise<{ success: boolean; data: TableGroup }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating table group:', error);
      throw error;
    }
  }

  async deleteTableGroup(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting table group:', error);
      throw error;
    }
  }

  // Table Management
  async addTableToGroup(groupId: string, tableData: Partial<Table>): Promise<{ success: boolean; data: TableGroup }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/${groupId}/tables`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tableData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding table to group:', error);
      throw error;
    }
  }

  async updateTableInGroup(groupId: string, tableId: string, tableData: Partial<Table>): Promise<{ success: boolean; data: TableGroup }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/${groupId}/tables/${tableId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(tableData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating table in group:', error);
      throw error;
    }
  }

  async removeTableFromGroup(groupId: string, tableId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/${groupId}/tables/${tableId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error removing table from group:', error);
      throw error;
    }
  }

  async generateTableQR(groupId: string, tableId: string): Promise<{ success: boolean; data: { tableId: string; qrCode: string } }> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/${groupId}/tables/${tableId}/qr`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating table QR code:', error);
      throw error;
    }
  }

  // Public endpoints
  async getAvailableTables(branchId: string): Promise<AvailableTablesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/available/${branchId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching available tables:', error);
      throw error;
    }
  }

  async getTableByQR(qrCode: string): Promise<TableByQRResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/qr/${encodeURIComponent(qrCode)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching table by QR code:', error);
      throw error;
    }
  }

  // Statistics
  async getTableOrderingStats(): Promise<TableOrderingStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/table-ordering/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching table ordering stats:', error);
      throw error;
    }
  }

  // Helper methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  }

  getGroupStatusBadgeColor(isEnabled: boolean): string {
    return isEnabled
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  }

  getTableStatusBadgeColor(isEnabled: boolean): string {
    return isEnabled
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  }

  getGroupDisplay(group: TableGroup): string {
    const enabledTables = group.enabledTables || 0;
    const totalTables = group.totalTables || 0;
    return `${group.name} (${enabledTables}/${totalTables} tables)`;
  }

  getTableDisplay(table: Table): string {
    const serviceCharge = table.serviceCharge > 0 ? ` - ${this.formatCurrency(table.serviceCharge)}` : '';
    const minSpend = table.minSpend > 0 ? ` (Min: ${this.formatCurrency(table.minSpend)})` : '';
    return `${table.name}${serviceCharge}${minSpend}`;
  }

  getCapacityDisplay(capacity: number): string {
    return capacity === 1 ? '1 person' : `${capacity} people`;
  }

  getGroupSummary(group: TableGroup): string {
    const parts: string[] = [];
    
    if (group.totalTables > 0) {
      parts.push(`${group.totalTables} table${group.totalTables !== 1 ? 's' : ''}`);
    }
    
    if (group.totalCapacity > 0) {
      parts.push(`${group.totalCapacity} capacity`);
    }
    
    if (group.defaultServiceCharge > 0) {
      parts.push(`${this.formatCurrency(group.defaultServiceCharge)} service charge`);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'No details';
  }

  validateGroupData(groupData: Partial<TableGroup>): string[] {
    const errors: string[] = [];

    if (!groupData.name || groupData.name.trim().length === 0) {
      errors.push('Group name is required');
    }

    if (!groupData.buttonLabel || groupData.buttonLabel.trim().length === 0) {
      errors.push('Button label is required');
    }

    if (groupData.displayOrder !== undefined && groupData.displayOrder < 0) {
      errors.push('Display order cannot be negative');
    }

    if (groupData.defaultServiceCharge !== undefined && groupData.defaultServiceCharge < 0) {
      errors.push('Default service charge cannot be negative');
    }

    if (groupData.defaultMinSpend !== undefined && groupData.defaultMinSpend < 0) {
      errors.push('Default minimum spend cannot be negative');
    }

    return errors;
  }

  validateTableData(tableData: Partial<Table>): string[] {
    const errors: string[] = [];

    if (!tableData.name || tableData.name.trim().length === 0) {
      errors.push('Table name is required');
    }

    if (tableData.serviceCharge !== undefined && tableData.serviceCharge < 0) {
      errors.push('Service charge cannot be negative');
    }

    if (tableData.minSpend !== undefined && tableData.minSpend < 0) {
      errors.push('Minimum spend cannot be negative');
    }

    if (tableData.capacity !== undefined && tableData.capacity < 1) {
      errors.push('Table capacity must be at least 1');
    }

    return errors;
  }

  sortGroupsByDisplayOrder(groups: TableGroup[]): TableGroup[] {
    return [...groups].sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.name.localeCompare(b.name);
    });
  }

  sortTablesByName(tables: Table[]): Table[] {
    return [...tables].sort((a, b) => a.name.localeCompare(b.name));
  }

  generateQRCodeURL(qrData: string): string {
    // This would typically use a QR code generation library
    // For now, return a placeholder URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  }

  parseQRCodeData(qrCode: string): { branchId?: string; groupId?: string; tableId?: string } | null {
    try {
      // Expected format: http://localhost:3000/table-order/{branchId}/{groupId}/{tableId}
      const url = new URL(qrCode);
      const pathParts = url.pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length >= 4 && pathParts[0] === 'table-order') {
        return {
          branchId: pathParts[1],
          groupId: pathParts[2],
          tableId: pathParts[3]
        };
      }
      
      return null;
    } catch {
      return null;
    }
  }

  getTableOrderingURL(branchId: string, groupId: string, tableId: string): string {
    const baseURL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
    return `${baseURL}/table-order/${branchId}/${groupId}/${tableId}`;
  }
}

export const tableOrderingService = new TableOrderingService(); 