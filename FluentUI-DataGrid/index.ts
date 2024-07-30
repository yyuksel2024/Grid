import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { DataGrid, IDataGridProps } from "./FluentUI-DataGrid";
import * as React from "react";

export class FluentUIDataGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;

    constructor() {}

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const dataSet = context.parameters.sampleDataSet;
        const items = this.getItems(dataSet);
    
        // Tüm sütunları oluştur
        const columns = dataSet.columns.map(column => ({
            key: column.name,
            name: column.displayName,
            fieldName: column.name,
            minWidth: 100,
            maxWidth: 200,
            isResizable: true,
            data: { field: column.name },
        }));
    
        const props: IDataGridProps = {
            name: context.parameters.name.raw || "",
            data: items,
            headerWidth: context.parameters.headerWidth.raw || 1200,
            height: context.parameters.height.raw || 800,
            headerHeight: 60,
            contentHeight: (context.parameters.height.raw || 800) - 60,
            filterPanelWidth: 0,
            dataListWidth: 0,
            detailViewWidth: 0,
            columns: columns,
        };
    
        return React.createElement(DataGrid, props);
    }
    
    private getItems(dataSet: ComponentFramework.PropertyTypes.DataSet): any[] {
        return dataSet.sortedRecordIds.map(recordId => {
            const record = dataSet.records[recordId];
            const item: any = {};
            dataSet.columns.forEach(column => {
                item[column.name] = record.getFormattedValue(column.name);
            });
            return item;
        });
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}