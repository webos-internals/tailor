function HelpAssistant()
{
	
};

HelpAssistant.prototype.setup = function()
{
	this.controller.get('help-title').innerHTML = $L('Help');
	this.controller.get('help-support').innerHTML = $L('Support');
	
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, {visible: false});
	
	this.controller.get('appname').innerHTML = Mojo.appInfo.title;
	this.controller.get('appdetails').innerHTML = Mojo.appInfo.version + $L(' by WebOS Internals');
	
	this.iconElement =			this.controller.get('icon');
	this.iconTapHandler = this.iconTap.bindAsEventListener(this);
	this.controller.listen(this.iconElement,  Mojo.Event.tap, this.iconTapHandler);

	this.supportModel = 
	{
		items: []
	};
	
	this.supportModel.items.push({
		text: $L('Wiki Page'),
		detail: 'http://www.webos-internals.org/wiki/Application:Tailor',
		Class: 'img_web',
		type: 'web'
	});
	this.supportModel.items.push({
		text: $L('IRC Channel'),
		detail: 'http://webchat.freenode.net?channels=webos-internals',
		Class: 'img_web',
		type: 'web'
	});
	this.supportModel.items.push({
		text: $L('Changelog'),
		Class: 'img_changelog',
		type: 'changelog'
	});
	
	this.controller.setupWidget
	(
		'supportList', 
		{
			itemTemplate: "help/rowTemplate",
			swipeToDelete: false,
			reorderable: false
		},
		this.supportModel
	);
	
	this.controller.listen('supportList', Mojo.Event.listTap, this.listTapHandler.bindAsEventListener(this));
	
};
HelpAssistant.prototype.listTapHandler = function(event)
{
	switch (event.item.type)
	{
		case 'web':
			this.controller.serviceRequest("palm://com.palm.applicationManager", 
			{
				method: "open",
				parameters: 
				{
					id: 'com.palm.app.browser',
					params: 
					{
						target: event.item.detail
					}
				}
			});
			break;
			
		case 'email':
			this.controller.serviceRequest('palm://com.palm.applicationManager', 
			{
				method: 'open',
				parameters: 
				{
					target: 'mailto:' + event.item.address + "?subject=" + Mojo.appInfo.title + " " + event.item.subject
				}
			});
			break;
			
		case 'changelog':
			this.controller.stageController.pushScene('startup', true);
			break;
			
		case 'scene':
			this.controller.stageController.pushScene(event.item.detail);
			break;
	}
};

HelpAssistant.prototype.iconTap = function(event)
{
	this.controller.stageController.popScene();
};

HelpAssistant.prototype.activate = function(event) {};
HelpAssistant.prototype.deactivate = function(event) {};
HelpAssistant.prototype.cleanup = function(event)
{
	this.controller.stopListening(this.iconElement,  Mojo.Event.tap, this.iconTapHandler);
	this.controller.stopListening('supportList', Mojo.Event.listTap, this.listTapHandler.bindAsEventListener(this));
};

// Local Variables:
// tab-width: 4
// End:
