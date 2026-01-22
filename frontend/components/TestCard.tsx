import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface TestCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  href: string
}

export default function TestCard({
  title,
  description,
  icon: Icon,
  color,
  href,
}: TestCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer h-full">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="mt-4 text-primary-600 font-semibold">
          Start Test →
        </div>
      </div>
    </Link>
  )
}
