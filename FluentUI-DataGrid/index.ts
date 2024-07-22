import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { DataGrid, IDataGridProps } from "./FluentUI-DataGrid";
import * as React from "react";

export class FluentUIDataGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;

    constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const dataInputString = context.parameters.dataInput.raw || '[]';
        let jsonData;
        try {
            jsonData = JSON.parse(dataInputString);
        } catch (error) {
            console.error("Error parsing JSON data:", error);
            jsonData = [];
        }

        const totalHeight = context.parameters.height.raw || 800;
        const headerHeight = 60; // Varsayılan başlık yüksekliği
        const contentHeight = totalHeight - headerHeight;

        const props: IDataGridProps = {
            name: '',
            data: jsonData,
            headerWidth: context.parameters.headerWidth.raw || 1200, // Varsayılan bir değer
            height: totalHeight,
            headerHeight: headerHeight,
            contentHeight: contentHeight,
            filterPanelWidth: 0,
            dataListWidth: 0,
            detailViewWidth: 0
        };
    
        return React.createElement(DataGrid, props);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}