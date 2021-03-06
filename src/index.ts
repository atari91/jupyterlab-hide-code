import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
    PanelLayout 
} from '@phosphor/widgets';

import {
  JupyterFrontEnd, JupyterFrontEndPlugin 
} from '@jupyterlab/application';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookActions, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';


const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jlab-hide-code:buttonPlugin',
  autoStart: true,
  activate  
};


export
class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {

  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
  
    let hideInputCode = () => {
      NotebookActions.runAll(panel.content, context.session);   

      panel.content.widgets.forEach(cell => {
        if (cell.model.type === 'code'){
            let layout = cell.layout as PanelLayout;
            layout.widgets[1].hide(); 
        } 
      }); 
      buttonHideInput.hide();
      buttonShowInput.show(); 
    };
	let showInputCode = () => {

      panel.content.widgets.forEach(cell => {
        if (cell.model.type === 'code'){
            let layout = cell.layout as PanelLayout;
            layout.widgets[1].show(); 
        } 
      }); 

      buttonHideInput.show();
      buttonShowInput.hide(); 
	};
  
    let buttonHideInput = new ToolbarButton({
      className: 'myButton',
      iconClassName: 'fa fa-eye-slash',
      onClick: hideInputCode,
      tooltip: 'Hide Input'
    });
	
	let buttonShowInput = new ToolbarButton({
      className: 'myButton',
      iconClassName: 'fa fa-eye',
      onClick: showInputCode,
      tooltip: 'Show Input' 
    });

    buttonShowInput.hide(); 

    panel.toolbar.insertItem(9, 'hideInput', buttonHideInput);
	panel.toolbar.insertItem(9, 'showInput', buttonShowInput);

    return new DisposableDelegate(() => {
      buttonHideInput.dispose();
	  buttonShowInput.dispose();
    });
  }

}

function activate(app: JupyterFrontEnd) {
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
};

export default plugin;
