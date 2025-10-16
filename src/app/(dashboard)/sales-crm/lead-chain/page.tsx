import { ArrowLeft, ArrowRight, Plus, Lock } from 'lucide-react';

export default function LeadSyncTemplates() {
  const templates = [
    {
      id: 1,
      type: 'custom',
      icon: <Plus className="w-6 h-6" />,
      title: 'Setup on your own',
      description: 'You can choose your own source and destination of your choice to push your leads.',
      action: 'Setup now',
      actionType: 'button'
    },
    {
      id: 2,
      source: 'facebook',
      destination: 'zoho',
      title: 'Facebook Lead Ads',
      description: 'Sync leads from your Facebook Ad account to Zoho CRM using LeadChain.',
      action: 'Learn more',
      actionType: 'link'
    },
    {
      id: 3,
      source: 'zoho',
      destination: 'facebook',
      title: 'Facebook Conversion API',
      description: 'Sync lead events from your Zoho CRM account to Facebook pixel using Facebook conversion API.',
      action: 'Upgrade now to access',
      actionType: 'link',
      locked: true
    },
    {
      id: 4,
      source: 'zoho',
      destination: 'facebook',
      title: 'Facebook Conversion Leads',
      description: 'Sync lead events from your Zoho CRM account to Facebook pixel using conversion leads integration.',
      action: 'Learn more',
      actionType: 'link',
      secondaryAction: 'Upgrade now to access',
      locked: true
    },
    {
      id: 5,
      source: 'zoho',
      destination: 'facebook',
      title: 'Facebook Custom Audience',
      description: 'Sync lead events from your Zoho CRM account to Facebook Custom Audiences.',
      action: 'Upgrade now to access',
      actionType: 'link',
      locked: true
    },
    {
      id: 6,
      source: 'linkedin',
      destination: 'zoho',
      title: 'LinkedIn Lead Ads',
      description: 'Sync leads from your LinkedIn Ad account to Zoho CRM using LeadChain.',
      action: 'Setup now',
      actionType: 'button',
      highlighted: true
    },
    {
      id: 7,
      source: 'zoho',
      destination: 'linkedin',
      title: 'LinkedIn Conversion API',
      description: 'Sync lead events from your Zoho CRM account to LinkedIn Conversion using LinkedIn conversion API.',
      action: 'Upgrade now to access',
      actionType: 'link',
      locked: true
    },
    {
      id: 8,
      source: 'tiktok',
      destination: 'zoho',
      title: 'TikTok Lead Ads',
      description: 'Sync leads from your Tiktok Ad account to Zoho CRM using LeadChain.',
      action: 'Learn more',
      actionType: 'link'
    },
    {
      id: 9,
      source: 'zoho',
      destination: 'tiktok',
      title: 'TikTok Conversion API',
      description: 'Sync lead events from your Zoho CRM account to TikTok Conversions.',
      action: 'Upgrade now to access',
      actionType: 'link',
      locked: true
    }
  ];

  const getIcon = (platform: 'facebook' | 'zoho' | 'linkedin' | 'tiktok'): React.ReactNode => {
    const icons = {
      facebook: (
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">f</span>
        </div>
      ),
      zoho: (
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">Z</span>
        </div>
      ),
      linkedin: (
        <div className="w-10 h-10 bg-blue-700 rounded flex items-center justify-center">
          <span className="text-white font-bold">in</span>
        </div>
      ),
      tiktok: (
        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">TT</span>
        </div>
      )
    };
    return icons[platform];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-6">
        {/* Header */}
        <button className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to chains</span>
        </button>

        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Choose any pre-defined template from the list to sync your leads
        </h1>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Templates</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 flex items-center">
                <span className="mr-2">⚡</span>
                <span className="font-medium">All Templates</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center text-blue-600">
                <span className="mr-2">f</span>
                <span>Facebook</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center text-blue-700">
                <span className="mr-2">in</span>
                <span>LinkedIn</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center">
                <span className="mr-2">TT</span>
                <span>TikTok</span>
              </button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
                  template.highlighted ? 'ring-2 ring-red-500 ring-dashed' : ''
                }`}
              >
                {/* Icons */}
                <div className="flex items-center gap-3 mb-4">
                  {template.type === 'custom' ? (
                    <>
                      <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="w-10 h-10 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                    </>
                  ) : (
                    <>
                      {template.source && ['facebook', 'zoho', 'linkedin', 'tiktok'].includes(template.source) && getIcon(template.source as 'facebook' | 'zoho' | 'linkedin' | 'tiktok')}
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      {template.destination && ['facebook', 'zoho', 'linkedin', 'tiktok'].includes(template.destination) && getIcon(template.destination as 'facebook' | 'zoho' | 'linkedin' | 'tiktok')}
                    </>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  {template.title}
                  {template.locked && <Lock className="w-4 h-4 text-gray-400" />}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {template.description}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {template.actionType === 'button' ? (
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium text-sm flex items-center justify-center gap-2">
                      {template.action}
                      {template.action === 'Setup now' && <ArrowRight className="w-4 h-4" />}
                    </button>
                  ) : (
                    <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {template.action}
                    </a>
                  )}
                  {template.secondaryAction && (
                    <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {template.secondaryAction}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}